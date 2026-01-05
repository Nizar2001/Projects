from django.db import models
from django.utils import timezone

class Conversation(models.Model):
    title = models.CharField(default='New Chat', max_length=100)
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['updated_at']

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    role = models.TextField()
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.conversation.updated_at = timezone.now()
        self.conversation.save(update_fields=['updated_at'])
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['timestamp']

class Summary(models.Model):
    conversation = models.OneToOneField(Conversation, on_delete=models.CASCADE, related_name='summary')
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='summaries')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['updated_at']
