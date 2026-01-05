from chat.models import Conversation, Summary
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from .serializers import UserSerializer
from django.contrib.sessions.backends.db import SessionStore
import uuid

User = get_user_model()

# Create your views here.

@login_required
def github_login_redirect(request):
    guest_user_id = request.session.get('guest_user_id')
    refresh = RefreshToken.for_user(request.user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    if guest_user_id:
        try:
            guest_user = User.objects.get(id=guest_user_id)
            Conversation.objects.filter(owner=guest_user).update(owner=request.user)
            Summary.objects.filter(owner=guest_user).update(owner=request.user)
            guest_user.delete()
            del request.session['guest_user_id']
        except User.DoesNotExist:
            pass

    request.session.flush()
    request.session.cycle_key()

    redirect_url = f"https://www.instructli.app/auth/callback?access={access_token}&refresh={refresh_token}"
    return HttpResponseRedirect(redirect_url)

@api_view(['GET'])
@permission_classes([AllowAny])
def create_guest_user(request):
    from django.contrib.auth import logout
    logout(request)
    username = f"guest_{uuid.uuid4().hex[:10]}"
    user = User.objects.create_user(username=username)
    refresh = RefreshToken.for_user(user)
    # Save guest_user_id in session
    request.session['guest_user_id'] = user.id
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user_id": user.id,  # <-- Add this line
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_jwt_for_social_user(request):
    refresh = RefreshToken.for_user(request.user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    try:
        username = user.username
        # Check if user has social auth (GitHub) - more robust check
        auth_method = 'guest'  # Default to guest
        
        # Check if user was created via social auth (GitHub)
        if hasattr(user, 'social_auth'):
            social_auths = user.social_auth.filter(provider='github')
            if social_auths.exists():
                auth_method = 'github'
        
        # Additional check: if username starts with 'guest_', it's definitely a guest
        if username.startswith('guest_'):
            auth_method = 'guest'
            
        return Response({
            "username": username,
            "auth_method": auth_method
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_stats(request):
    user = request.user
    if not user.is_instructor:
        return Response({"error": "you are not an instructor"}, status=400)
    
    serialized_users = UserSerializer(User.objects.all(), many=True).data
    return Response(reversed(serialized_users), status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_instructor(request):
    user = request.user
    return Response(user.is_instructor, status=200)
