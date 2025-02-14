from django.urls import path
from . import views

urlpatterns = [
    path("", views.clasindex, name="classes"),
]