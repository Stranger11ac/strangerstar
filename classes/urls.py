from django.urls import path
from .views import singuppage, indexprofile

urlpatterns = [
    path("singup/", singuppage, name="singuppage"),
    path("profile/", indexprofile, name="indexprofile"),
]