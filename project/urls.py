from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("jobs.urls")),
    path("school/", include("school.urls")),
    path("admin/", admin.site.urls),
]