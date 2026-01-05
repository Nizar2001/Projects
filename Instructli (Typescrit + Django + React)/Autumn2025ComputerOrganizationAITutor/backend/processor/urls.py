# processor/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("run/", views.run_processor, name="run_processor"),
]
