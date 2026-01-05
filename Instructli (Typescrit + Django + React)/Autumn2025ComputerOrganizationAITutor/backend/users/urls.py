from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('guest-session', views.create_guest_user),
    path('jwt-for-social', views.get_jwt_for_social_user, name='jwt_for_social'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('githubauth/', include('social_django.urls', namespace='social')),
    path('github-login-redirect/', views.github_login_redirect, name='github_login_redirect'),
    path('get_user_info/', views.get_user_info, name='get_user_info'),
    path('student-stats', views.get_student_stats),
    path('check-instructor', views.check_instructor),
]
