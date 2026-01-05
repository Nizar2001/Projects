from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from .models import QuizQuestion
from .serializers import QuizQuestionSerializer, QuizQuestionFilterSerializer, TagStatsSerializer, QuizQuestionRenderedSerializer
from .services.question_generator import generate_questions_from_test_bank

User = get_user_model()


class QuizQuestionListCreateView(generics.ListCreateAPIView):
    """List all quiz questions or create a new one. This endpoint 
    is used to list all quiz questions or create a new one.

    Only authenticated users can access this endpoint.
    user that can login to the admin site can access non-published questions.
    Note: 'is_staff' is not the same as 'is_superuser'.
    
    POST: Create a new quiz question (Create)
    GET: List all quiz questions (List)
    """
    queryset = QuizQuestion.objects.all()
    permission_classes = [AllowAny] 
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter] # Filters are used to filter the questions based on the type, difficulty, and published status.
    filterset_fields = ['type', 'difficulty', 'is_published'] # attributes for DjangoFilterBackend
    search_fields = ['question_string', 'tag'] # attribute for SearchFilter backend
    ordering_fields = ['created_at', 'updated_at', 'difficulty'] # attribute for OrderingFilter backend
    ordering = ['-created_at'] # default ordering for the questions
    
    def get_serializer_class(self):
        """Return the serializer class based on the request method.
        
        Note: same serializer is used for both operations (GET and POST).
        """
        return QuizQuestionSerializer
    
    def get_queryset(self):
        """Filter questions based on user permissions.
        Non-admin users only see published questions.
        """
        queryset = super().get_queryset()

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        
        return queryset
    

class QuizQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a quiz question. This endpoint 
    is used to retrieve, update or delete a quiz question. 
    
    Only authenticated users can access this endpoint.
    user that can login to the admin site can access non-published questions.
    Note: 'is_staff' is not the same as 'is_superuser'.
    
    GET: Retrieve a quiz question (Read)
    PUT: Update a quiz question (Update)
    PATCH: Update a quiz question (Update)
    DELETE: Delete a quiz question (Delete)
    """
    queryset = QuizQuestion.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        """Return the serializer class based on the request method.

        Note: same serializer is used for all operations (GET, PUT, PATCH, DELETE).        
        """
        return QuizQuestionSerializer
    
    def get_queryset(self):
        """Filter questions based on user permissions.
        Non-admin users only see published questions.

        Note: this filter is performed before the data is processed by the serializer.
        """
        queryset = super().get_queryset()
        
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        
        return queryset


class QuizQuestionPublishView(generics.UpdateAPIView):
    """Toggle publish status of a quiz question. This endpoint 
    is used to change/toggle the publish status of a quiz question.
    Only admin users can access this endpoint.

    PATCH: Change publish status of a quiz question (Update)
    """
    serializer_class = QuizQuestionSerializer
    queryset = QuizQuestion.objects.all()
    permission_classes = [AllowAny]
    
    def patch(self, request, *args, **kwargs):
        """
        Toggle the is_published status of a question.
        """
        question = self.get_object() # This is the queryset that is filtered based on the pk in the url.
        question.is_published = not question.is_published 
        question.save() 
        
        serializer = self.get_serializer(question)
        return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([])     # <--- REQUIRED
@permission_classes([AllowAny])
def quiz_question_stats(request):
    """Get statistics about quiz questions. 
    This endpoint is used to get statistics about quiz questions that are published.

    Only authenticated users can access this endpoint.
    
    GET: Get statistics about quiz questions (Read)
    """
    queryset = QuizQuestion.objects.all()
    
    # Filter the questions based on the user permissions.
    if not request.user.is_staff:
        queryset = queryset.filter(is_published=True)


    stats = {
        'total_questions': queryset.count(),
        'published_questions': queryset.filter(is_published=True).count(),
        'unpublished_questions': queryset.filter(is_published=False).count(),
        'by_difficulty': {
            'easy': queryset.filter(difficulty='easy').count(),
            'medium': queryset.filter(difficulty='medium').count(),
            'hard': queryset.filter(difficulty='hard').count(),
        },
        'by_type': {
            question_type: queryset.filter(type=question_type).count()
            for question_type, _ in QuizQuestion.QUESTION_TYPE_CHOICES
        }
    }
    
    return Response(stats)


@api_view(['GET'])
@authentication_classes([])     # <--- REQUIRED
@permission_classes([AllowAny])
def random_quiz_questions(request):
    """Get random quiz questions for practice.
    This endpoint is used to get random quiz questions for practice.
    Only authenticated users can access this endpoint.

    Filtering options:
    - difficulty: easy, medium, hard
    - type: multiple_choice, short_answer, true_false, fill_blank
    - limit: number of questions to return
    
    GET: Get random quiz questions for practice (Read)
    """
    difficulty = request.query_params.get('difficulty')
    question_type = request.query_params.get('type')
    limit = int(request.query_params.get('limit', 10))
    render = request.query_params.get('render') == 'true'
    
    queryset = QuizQuestion.objects.filter(is_published=True)
    
    if difficulty:
        queryset = queryset.filter(difficulty=difficulty)
    
    if question_type:
        queryset = queryset.filter(type=question_type)
    
    # Get random questions
    questions = queryset.order_by('?')[:limit]
    
    Serializer = QuizQuestionRenderedSerializer if render else QuizQuestionSerializer
    serializer = Serializer(questions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])     # <--- REQUIRED
def get_available_tags(request):
    """Get available tags with statistics.
    This endpoint is used to get available tags with statistics.
    Only authenticated users can access this endpoint.

    GET: Get available tags with statistics (Read)
    """
    # Get all unique tags with counts
    tag_stats = QuizQuestion.objects.values('tag').annotate(
        question_count=Count('id'),
        published_count=Count('id', filter=Q(is_published=True))
    ).order_by('tag')
    
    # Flatten the tag arrays and aggregate counts
    tag_temp = {}
    for item in tag_stats:
        for tag in item['tag']:
            if tag in tag_temp:
                tag_temp[tag]['question_count'] += item['question_count']
                tag_temp[tag]['published_count'] += item['published_count']
            else:
                tag_temp[tag] = {
                    'tag': tag,
                    'question_count': item['question_count'],
                    'published_count': item['published_count']
                }
    
    # Convert to list and sort by question count
    result = list(tag_temp.values())
    result.sort(key=lambda x: x['question_count'], reverse=True)
    
    serializer = TagStatsSerializer(result, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])     # <--- REQUIRED
def generate_questions(request):
    """Generate quiz questions from test_bank.json.
    
    Query parameters:
    - difficulty: 'easy', 'medium', or 'hard' (optional, for filtering)
    - use_ai: 'true' or 'false' (optional, default 'true' - whether to use OpenAI for generation)
    
    This endpoint:
    1. Loads questions from test_bank.json (filtered by difficulty if specified)
    2. Parses each question using the parser to generate random values
    3. If use_ai=true: Sends to OpenAI for generation and returns validated questions
    4. If use_ai=false: Returns parsed questions directly
    
    GET: Generate questions from test_bank.json (Read)
    
    Returns:
        List of questions:
        [
            {
                "question": "...",
                "type": "multiple_choice" or "short_answer",
                "options": [...],  # Only for multiple_choice
                "answer": "...",
                "difficulty": "...",
                "tag": [...],
                "explanation": "..."  # Optional, only for AI-generated questions
            },
            ...
        ]
    """
    try:
        difficulty = request.query_params.get('difficulty', None)
        use_ai_param = request.query_params.get('use_ai', 'true').lower()
        use_ai = use_ai_param == 'true'
        
        valid_questions = generate_questions_from_test_bank(
            difficulty=difficulty,
            use_ai=use_ai
        )
        return Response(valid_questions, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"Failed to generate questions: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])     # <--- REQUIRED
def get_questions_by_filter(request):
    """Get questions by filter criteria.
    This endpoint is used to get questions by filter criteria.
    Only authenticated users can access this endpoint.

    Filtering options:
    - tags: list of tags to filter by
    - difficulty: list of difficulty levels to filter by
    - type: list of question types to filter by
    - exclude_ids: list of question ids to exclude
    - count: number of questions to return

    POST: Get questions by filter criteria (Create)
    """
    # Validate the input data
    render = request.query_params.get('render') == 'true'
    serializer = QuizQuestionFilterSerializer(data=request.data)
    if not serializer.is_valid(): 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    # Start with published questions only
    queryset = QuizQuestion.objects.filter(is_published=True)
    
    # Apply filters
    if data.get('tags'):
        queryset = queryset.filter(tag__overlap=data['tags'])
    
    if data.get('difficulty'):
        queryset = queryset.filter(difficulty__in=data['difficulty'])
    
    if data.get('type'):
        queryset = queryset.filter(type__in=data['type'])
    
    if data.get('exclude_ids'):
        queryset = queryset.exclude(id__in=data['exclude_ids'])
    
    # Get random questions
    count = data.get('count', 10)
    questions = queryset.order_by("?")[:count] 
    
    Serializer = QuizQuestionRenderedSerializer if render else QuizQuestionSerializer
    response_serializer = Serializer(questions, many=True)
    return Response(response_serializer.data)