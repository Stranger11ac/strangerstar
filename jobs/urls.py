from . import views
from django.urls import path

urlpatterns = [
    path("", views.index, name="index"),
    path("singin/", views.singin, name="singin"),
    path("singout/", views.singout, name="singout"),

    path("proyectos/app_clima/", views.weather_app, name="weather_app"),
]