from django.urls import path
from . import views

urlpatterns = [
    # Quiz questions CRUD
    path('questions/', views.QuizQuestionListCreateView.as_view(), name='quiz-question-list-create'),
    path('questions/<int:pk>/', views.QuizQuestionDetailView.as_view(), name='quiz-question-detail'),
    path('questions/<int:pk>/publish/', views.QuizQuestionPublishView.as_view(), name='quiz-question-publish'),
    
    # Quiz utilities
    path('stats/', views.quiz_question_stats, name='quiz-stats'),
    path('random/', views.random_quiz_questions, name='quiz-random'),
    path('tags/', views.get_available_tags, name='quiz-tags'),
    path('questions/by-filter/', views.get_questions_by_filter, name='quiz-questions-by-filter'),
    path('generate/', views.generate_questions, name='quiz-generate-questions'),
]

