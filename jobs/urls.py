from . import views
from django.urls import path

urlpatterns = [
    path("", views.index, name="index"),
    path("singup/", views.singup, name="singup"),
    path("singin/", views.singin, name="singin"),
    path("singout/", views.singout, name="singout"),
    path("proyectos/iconos/", views.jobicons, name="jobicons"),
]