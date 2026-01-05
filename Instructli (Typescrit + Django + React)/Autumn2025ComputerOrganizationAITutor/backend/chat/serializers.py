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

class PipelineDiagramSerializer(serializers.Serializer):
    cycle = serializers.IntegerField()
    stages = serializers.DictField()
    stageDetails = serializers.DictField()
    component = serializers.DictField()
    hazards = serializers.ListField()

class DiagramSerializer(serializers.Serializer):
    """ Polymorphic serializer for two possible types of diagram context
    """
    def to_internal_value(self, data):
        errors = {}

        try:
            single = SingleDiagramSerializer(data=data)
            single.is_valid(raise_exception=True)
            self._validated_data = single.validated_data
            self._validated_serializer = single
            return self._validated_data
        except ValidationError as e:
            errors['SingleDiagramSerializer'] = e.detail

        try:
            pipeline = PipelineDiagramSerializer(data=data, many=True)
            pipeline.is_valid(raise_exception=True)
            self._validated_data = pipeline.validated_data
            self._validated_serializer = pipeline
            return self._validated_data
        except ValidationError as e:
            errors['PipelineDiagramSerializer'] = e.detail

        raise ValidationError({
            'diagram': 'Input does not match any known diagram type.',
            'errors': errors
        })

class ChatQuerySerializer(serializers.Serializer):
    message = MessageSerializer()
    diagram = DiagramSerializer(allow_null=True)
    diagram_type = serializers.CharField(allow_null=True)
    curr_cycle = serializers.IntegerField(allow_null=True)

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
