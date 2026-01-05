from django.urls import path
from . import views

urlpatterns = [
    path('query', views.send_message),
    path('stream-response/<uuid:query_id>', views.get_response),
    path('new-chat', views.new_chat),
    path('current-conversation', views.get_current_conversation),
    path('conversation-summary', views.summarize_conversation),
    path('summaries', views.get_summaries),
    path('summaries/<int:id>', views.get_summary),  
    path('conversations', views.get_conversations),
    path('set-conversation', views.set_current_conversation),
    path('rename-conversation', views.rename_conversation),
    path('delete-conversation', views.delete_conversation),
    path('generate-title', views.generate_title),
    path('delete-summary', views.delete_summary),
]
