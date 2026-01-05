import uuid
from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Message, Conversation, Summary
from .serializers import MessageSerializer, ChatQuerySerializer, SummaryListSerializer, SummarySerializer, ConversationListSerializer, ConversationSerializer
from chat.services.clients import r2r, openai
from pydantic import BaseModel

User = get_user_model()

class SummaryModel(BaseModel):
    title: str
    summary: str

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request):
    """ Cache query details for get_response. We do this because EventSource
    only makes a GET request. So we cache this query and return a lookup key.
    """
    serializer = ChatQuerySerializer(data=request.data)
    if not serializer.is_valid():
        print(serializer.error_messages)
        return Response(serializer.errors, status=400)

    cache_key = str(uuid.uuid4()) 

    cache.set(cache_key, {
        "user_id": request.user.id,
        "data": serializer.validated_data,
    }, timeout=120)

    return Response({"cache_key": cache_key}, status=200)

@require_GET
def get_response(request, query_id):
    """ Get a streaming response from LLM from cached query
    """
    # ────────────────────── retrieve cached info ─────────────────────────────
    cached = cache.get(query_id)
    if not cached:
        return JsonResponse({"error": "cached query not found"}, status=404)
    
    try:
        user = User.objects.get(id=cached.get("user_id"))
    except User.DoesNotExist:
        return JsonResponse({"error": "cached user does not exist"}, status=404)
    
    data = cached["data"]
    message = data["message"]
    page = data["page"]
    context = data["context"]

    # ───────────────────────── create new message ────────────────────────────
    conversation = user.current_conversation
    Message.objects.create(
        conversation=conversation,
        role=message["role"],
        content=message["content"],
    ) 

    # ─────────────── adjust retrieval and diagram prompts ────────────────────
    search_query = message["content"]
    if context:
        if page == "single":
            search_query = (
                f"Answer this for **single cycle processors**: \n{search_query}"
                f"\nCommand type: {context["command_type"]}"
                f"\nCommand: {context["command"]}"
            )
        elif page == "pipeline":
            search_query += "\nPipelined processor diagram representation: " + str(context)
        elif page == "quiz":
            search_query += "\nQuestions to answer: " + str(context)
        elif page in ["arithmetic", "numbersystems", "overflow", "operations", "signed"]:
            search_query += "\nArithmetic HTML Content:\n" + str(context)

    # ────────────────────── RAG document retrieval ───────────────────────────
    results = r2r.retrieval.search(
        query=search_query,
        search_settings={
            "limit": 5,
        },
    ).results.chunk_search_results
    documents = {i: result.text for i, result in enumerate(results)}

    # ───────────── generate and return streaming response ────────────────────
    prompt_map = {
        "single": "pmpt_691ff6a2eae88195b9926e8f3e0784650548c2a1c6c3c966",
        "pipeline": "pmpt_691ff7c03be48195bcac24d45c86640d01cb93a44eeddd87",
        "quiz": "pmpt_6924b4a0e3f48195a119bcd0260d72440584b616b8040140",
        "arithmetic": "pmpt_692740b000408193a5779d7f911c303404fdf20827616575",
        "calculator": "pmpt_6927c02d190c8193a29100082b33980e0748cdb8b20a70f0",
    }
    messages = MessageSerializer(conversation.messages.all(), many=True).data
    def generate():
        try:
            stream = openai.responses.create(
                model="gpt-4.1-mini",
                prompt={
                    "id": prompt_map.get(page, ""),
                    "variables": {
                        "documents": str(documents),
                        "context": str(context),
                    },
                },
                input=messages,
                stream=True,
            )
            for event in stream:
                if event.type == "response.output_text.delta":
                    escaped_delta = event.delta.replace('\n', '\\n')
                    yield f"data: {escaped_delta}\n\n"
                elif event.type == "response.completed":
                    Message.objects.create(
                        conversation=conversation,
                        role="assistant",
                        content=event.response.output_text,
                    )
            yield f"data: [DONE]\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"
        
    return StreamingHttpResponse(generate(), content_type="text/event-stream")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_title(request):
    conversation = request.user.current_conversation
    messages = MessageSerializer(conversation.messages.all(), many=True).data
    title = openai.responses.create(
        model="gpt-4.1-mini",
        prompt={
            "id": "pmpt_68ad1115123c8197afe6d7a7268a3dab05c708223e16d6b5",
            "variables": {
                "conversation": str(messages),
            },
        },
    ).output_text
    conversation.title = title
    conversation.save()
    return Response({"id": conversation.id, "title": conversation.title}, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def new_chat(request):
    """ Start a new chat session
    """
    user = request.user
    messages = user.current_conversation.messages.all()
    if not messages:
        return Response(status=204)
    user.current_conversation = Conversation.objects.create(owner=user)
    user.save()
    return Response(status=204)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_conversation(request):
    """ Return current conversation
    """
    user = request.user
    serialized_conversation = ConversationSerializer(user.current_conversation).data
    return Response(serialized_conversation, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    user = request.user
    conversations = Conversation.objects.filter(owner=user)
    return Response(ConversationListSerializer(conversations, many=True).data, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def set_current_conversation(request):
    user = request.user
    conversation_id = request.data["id"]

    try:
        conversation = Conversation.objects.get(owner=user, id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({"error": "conversation not found"}, status=404)
    
    user.current_conversation = conversation
    user.save()
    return Response(status=204)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def rename_conversation(request):
    user = request.user
    conversation_id = request.data["id"]
    new_name = request.data["name"]

    try:
        conversation = Conversation.objects.get(owner=user, id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({"error": "conversation does not exist"}, status=404)
    
    if len(new_name) > 100:
        return Response({"error": "name too long"}, status=400)
    
    conversation.title = new_name
    conversation.save()

    return Response(status=204)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_conversation(request):
    user = request.user
    conversation_id = request.data["id"]

    try:
        conversation = Conversation.objects.get(owner=user, id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({"error": "conversation does not exist"}, status=404)
    
    if user.current_conversation == conversation:
        user.current_conversation = Conversation.objects.create(owner=user)
        user.save()

    conversation.delete()

    return Response(status=204)

def summarize(conversation: Conversation):
    user = conversation.owner
    history = MessageSerializer(conversation.messages.all(), many=True).data
    if not history:
        return
    
    response = openai.responses.parse(
        model="gpt-4.1-mini",
        prompt={
            "id": "pmpt_68a0ed56403c8196a4db68ff42ce75490aca82d8d3a37edf",
            "variables": {
                "conversation": str(history),
            }
        },
        text_format=SummaryModel,
    ).output_parsed

    Summary.objects.create(
        conversation=user.current_conversation,
        owner=user,
        title=response.title,
        content=response.summary,
    )

def resummarize(conversation: Conversation):
    summary = conversation.summary
    history = MessageSerializer(conversation.messages.all(), many=True).data

    response = openai.responses.create(
        model="gpt-4.1-mini",
        prompt={
            "id": "pmpt_68ae0e52b96881909426cbb62c7904270d1b39ba2b810e40",
            "variables": {
                "previous_summary": summary.content,
                "conversation": str(history),
            },
        },
    ).output_text

    summary.content = response
    summary.save()

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def summarize_conversation(request):
    user = request.user
    conversation_id = request.data["id"]

    try:
        conversation = Conversation.objects.get(owner=user, id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({"error": "conversation does not exist"}, status=404)

    if Summary.objects.filter(owner=user, conversation=conversation).exists():
        resummarize(conversation)
    else:
        summarize(conversation)

    return Response(status=204)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_summaries(request):
    user = request.user
    serializer = SummaryListSerializer(user.summaries.all(), many=True)
    return Response(serializer.data, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_summary(request, id):
    summary = get_object_or_404(Summary, id=id, owner=request.user)
    serializer = SummarySerializer(summary)
    return Response(serializer.data, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_summary(request):
    summary = get_object_or_404(Summary, id=request.data["id"], owner=request.user)
    summary.delete()
    return Response(status=204)
