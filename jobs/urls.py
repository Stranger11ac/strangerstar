from .views import index, jobicons, singup, singin, singout
from django.urls import path

urlpatterns = [
    path("", index, name="index"),
    path("singup/", singup, name="singup"),
    path("singin/", singin, name="singin"),
    path("singout/", singout, name="singout"),
    path("proyectos/iconos/", jobicons, name="jobicons"),
]