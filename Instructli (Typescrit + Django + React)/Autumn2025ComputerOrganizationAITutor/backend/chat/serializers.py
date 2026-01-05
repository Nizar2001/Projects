from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Message, Summary, Conversation

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['role', 'content']

class ConversationListSerializer(serializers.ModelSerializer):
    """ Used to list conversation data without messages
    """
    has_summary = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'has_summary']

    def get_has_summary(self, obj):
        try:
            return bool(obj.summary)
        except AttributeError:
            return False
        
class ConversationSerializer(ConversationListSerializer):
    """ Used to serialize the entire conversation
    """
    messages = serializers.SerializerMethodField()

    class Meta(ConversationListSerializer.Meta):
        fields = ConversationListSerializer.Meta.fields + ['messages']

    def get_messages(self, obj):
        return MessageSerializer(obj.messages.all(), many=True).data

class SingleDiagramSerializer(serializers.Serializer):
    command = serializers.CharField()
    command_type = serializers.CharField()
    data_path = serializers.DictField()
    block_data = serializers.DictField()

class PipelineStageSerializer(serializers.Serializer):
    cycle = serializers.IntegerField()
    stages = serializers.DictField()
    stageDetails = serializers.DictField()
    component = serializers.DictField()
    hazards = serializers.ListField()

class PipelineDiagramSerializer(serializers.Serializer):
    curr_cycle = serializers.IntegerField()
    diagram = PipelineStageSerializer(many=True)

class QuizResultSerializer(serializers.Serializer):
    correctAnswer = serializers.CharField()
    description = serializers.CharField()
    givenAnswer = serializers.CharField(allow_null=True)
    number = serializers.IntegerField()

class ContextSerializer(serializers.Serializer):
    """ Polymorphic serializer for different types of context
    """
    def to_internal_value(self, data):
        page = self.context.get("page")
        if page == "single":
            serializer = SingleDiagramSerializer(data=data)
        elif page == "pipeline":
            serializer = PipelineDiagramSerializer(data=data)
        elif page == "quiz":
            serializer = QuizResultSerializer(data=data, many=True)
        elif page == "arithmetic":
            field = serializers.CharField()
            return field.run_validation(data)
        elif page == "calculator":
            field = serializers.CharField()
            return field.run_validation(data)
        else:
            return None
        
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

class ChatQuerySerializer(serializers.Serializer):
    message = MessageSerializer()
    page = serializers.CharField(allow_null=True)
    context = ContextSerializer(allow_null=True)

    def to_internal_value(self, data):
        self.fields["context"].context["page"] = data.get("page")
        return super().to_internal_value(data)

class SummaryListSerializer(serializers.ModelSerializer):
    """ Used for serializing summaries without their content
    """
    preview = serializers.SerializerMethodField()
    conversation_id = serializers.SerializerMethodField()

    class Meta:
        model = Summary
        fields = ['id', 'title', 'updated_at', 'preview', 'conversation_id']

    def get_preview(self, obj):
        return obj.content[:200] + "..."
    
    def get_conversation_id(self, obj):
        return obj.conversation.id

class SummarySerializer(SummaryListSerializer):
    """ Used for serializing summaries with their content
    """
    class Meta(SummaryListSerializer.Meta):
        fields = SummaryListSerializer.Meta.fields + ['content']
