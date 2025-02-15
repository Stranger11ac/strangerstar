from django.urls import path
from .views import index, jobicons, singup

urlpatterns = [
    path("", index, name="index"),
    path("singup", singup, name="singup"),
    path("proyectos/iconos", jobicons, name="jobicons"),
]