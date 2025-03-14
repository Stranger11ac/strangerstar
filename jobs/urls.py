from . import views
from django.urls import path

urlpatterns = [
    path("", views.index, name="index"),
    path("singin/", views.singin, name="singin"),
    path("singout/", views.singout, name="singout"),

    path("proyectos/weather_app/", views.weather_app, name="weather_app"),
    path("proyectos/spin_app/", views.spin_app, name="spin_app"),
    path("proyectos/spin_up_list/", views.spin_up_list, name="spin_up_list"),
    path("proyectos/calendar_app/", views.calendar_app, name="calendar_app"),
]