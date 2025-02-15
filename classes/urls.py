from django.urls import path
from . import views

urlpatterns = [
    path("singup/", views.singuppage, name="singuppage"),
]