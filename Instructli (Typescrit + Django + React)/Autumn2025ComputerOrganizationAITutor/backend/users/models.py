from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser
from chat.models import Conversation

# Create your models here.

class User(AbstractUser):
    is_instructor = models.BooleanField(default=False)
    current_conversation = models.OneToOneField(Conversation, on_delete=models.SET_NULL, null=True, blank=True)

@receiver(post_save, sender=User)
def create_initial_conversation(sender, instance, created, **kwargs):
    if created and not instance.current_conversation:
        conversation = Conversation.objects.create(owner=instance)
        instance.current_conversation = conversation
        instance.save()
