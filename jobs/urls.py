from . import views
from django.urls import path

urlpatterns = [
    path("", views.index, name="index"),
    path("singin/", views.singin, name="singin"),
    path("singout/", views.singout, name="singout"),
]