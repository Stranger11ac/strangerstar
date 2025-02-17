from django.urls import path
from .views import singuppage, indexprofile, forgotten

urlpatterns = [
    path("", forgotten, name="forgotten"),
    path("singup/", singuppage, name="singuppage"),
    path("profile/", indexprofile, name="indexprofile"),
]