from rest_framework import serializers
from .models import QuizQuestion
from .services.parser import generate_question_instance


class QuizQuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for QuizQuestion model with all fields.
    Used for both reading and creating quiz questions.
    """
    
    class Meta:
        model = QuizQuestion
        fields = [
            'id',
            'question_string',
            'type',
            'answer',
            'tag',
            'is_published',
            'difficulty',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data): # reference: https://www.django-rest-framework.org/api-guide/serializers/#validation
        """
        Validate the entire object for both creation and updates.
        """
        question_type = data.get('type')
        answer = data.get('answer')
        
        if question_type == 'multiple_choice':
            if not isinstance(answer, dict):
                raise serializers.ValidationError({
                    'answer': 'Answer must be a dictionary for multiple choice questions'
                })
            if 'options' not in answer or 'correct_answer' not in answer:
                raise serializers.ValidationError({
                    'answer': "Multiple choice answers must have 'options' and 'correct_answer' keys"
                })
            if not isinstance(answer['options'], list) or len(answer['options']) < 2:
                raise serializers.ValidationError({
                    'answer': "Options must be a list with at least 2 items"
                })
            if answer['correct_answer'] not in answer['options']:
                raise serializers.ValidationError({
                    'answer': "Correct answer must be one of the options"
                })
        else:
            # Convert to string if it's a number
            if isinstance(answer, (int, float)):
                answer = str(answer)
                data['answer'] = answer  # Update the data with converted answer
            elif not isinstance(answer, str):
                raise serializers.ValidationError({
                    'answer': 'Answer must be a string for non-multiple choice questions'
                })
        
        return data
    
    def validate_tag(self, value):
        """
        Validate tag list.
        """
        if len(value) > 10:
            raise serializers.ValidationError("Maximum 10 tags allowed")
        
        for tag in value:
            if len(tag) > 50:
                raise serializers.ValidationError("Each tag must be 50 characters or less")
        
        return value






class QuizQuestionFilterSerializer(serializers.Serializer):
    """
    Serializer for quiz question filter endpoint.
    """
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        help_text="List of tags to filter by"
    )
    difficulty = serializers.ListField(
        child=serializers.ChoiceField(choices=QuizQuestion.DIFFICULTY_CHOICES),
        required=False,
        help_text="List of difficulty levels to filter by"
    )
    type = serializers.ListField(
        child=serializers.ChoiceField(choices=QuizQuestion.QUESTION_TYPE_CHOICES),
        required=False,
        help_text="List of question types to filter by"
    )
    count = serializers.IntegerField(
        min_value=1,
        max_value=100,
        default=10,
        help_text="Number of questions to return"
    )
    exclude_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="List of question IDs to exclude"
    )


class TagStatsSerializer(serializers.Serializer):
    """
    Serializer for tag statistics.
    """
    tag = serializers.CharField()
    question_count = serializers.IntegerField()
    published_count = serializers.IntegerField()


class QuizQuestionRenderedSerializer(serializers.ModelSerializer):
    rendered_question = serializers.SerializerMethodField() # rendered question text
    rendered_answer = serializers.SerializerMethodField() # rendered answer text
    variables = serializers.SerializerMethodField() # variables used in the question

    class Meta: # fields to be serialized
        model = QuizQuestion
        fields = [ # this doesn't return any function-like strings
            'id',
            'question_string',
            'type',
            'tag',
            'difficulty',
            'is_published',
            'rendered_question',
            'rendered_answer',
            'variables',
        ]

    def get_rendered_question(self, obj): # get the rendered question text
        inst = self._get_instance(obj)
        return inst['question_text']

    def get_rendered_answer(self, obj):
        inst = self._get_instance(obj)
        return inst['answer_text']

    def get_variables(self, obj):
        inst = self._get_instance(obj)
        return inst['variables']

    def _get_instance(self, obj): # obj is the QuizQuestion instance
        """Get the rendered question instance.
        """
        cache_key = f'_render_inst_{obj.id}'
        if not hasattr(obj, cache_key):
            # hasattr and setattr are python built-in functions.
            # This does not save anything to the database.
            # It only attaches an in-memory attribute to the Python object instance
            # for the duration of this process/request (used as a cache), NOT a DB field.
            setattr(obj, cache_key, generate_question_instance(obj))
        return getattr(obj, cache_key)

