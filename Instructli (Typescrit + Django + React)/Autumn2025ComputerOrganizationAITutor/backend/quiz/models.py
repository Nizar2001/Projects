from django.db import models
from django.contrib.postgres.fields import ArrayField
import json


class QuizQuestion(models.Model):
    """Model representing a quiz question with all required fields.

    Columns:
    - question_string: the question text
    - type: the type of question
    - answer: the answer to the question
    - tag: the tags for the question
    - is_published: whether the question is published
    - difficulty: the difficulty of the question
    - created_at: the date and time the question was created
    - updated_at: the date and time the question was last updated

    relationships:
    - none

    """
    
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    QUESTION_TYPE_CHOICES = [
        ('multiple_choice', 'Multiple Choice'),
        ('short_answer', 'Short Answer'),
        ('true_false', 'True/False'),
        ('fill_blank', 'Fill in the Blank'),
    ]
    
    question_string = models.TextField(help_text="The question text")
    type = models.CharField(
        max_length=20, 
        choices=QUESTION_TYPE_CHOICES,
        help_text="Type of question"
    )
    answer = models.JSONField(
        help_text="Answer data - can be dict with options or string"
    )
    tag = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        default=list,
        help_text="List of tags for categorization"
    )
    is_published = models.BooleanField(
        default=False,
        help_text="Whether the question is published and visible to users"
    )
    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        help_text="Difficulty level of the question"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Quiz Question"
        verbose_name_plural = "Quiz Questions"
    
    def get_answer_options(self):
        """Helper method to get answer options for multiple choice questions.
        Returns None if not a multiple choice question.

        Not necessary in usage for now, but useful for future functionality.
        """
        if self.type == 'multiple_choice' and isinstance(self.answer, dict):
            return self.answer.get('options', [])
        return None
    
    def get_correct_answer(self):
        """Helper method to get the correct answer.
        For multiple choice, returns the correct option.
        For other types, returns the answer string.
        
        Not necessary in usage for now, but useful for future functionality.
        """
        if self.type == 'multiple_choice' and isinstance(self.answer, dict):
            return self.answer.get('correct', '')
        return self.answer if isinstance(self.answer, str) else ''