from rest_framework import serializers
from .models import User
from chat.serializers import ConversationSerializer, SummarySerializer

class UserSerializer(serializers.ModelSerializer):
    conversations = serializers.SerializerMethodField()
    summaries = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'conversations', 'summaries']
    
    def get_conversations(self, obj):
        return ConversationSerializer(obj.conversations.all(), many=True).data

    def get_summaries(self, obj):
        return SummarySerializer(obj.summaries.all(), many=True).data
