from django.urls import path
from . import views

urlpatterns = [
    path("", views.forgotten, name="forgotten"),
    path("singup/", views.singuppage, name="singuppage"),
    
    path('admin/', views.admin_dashboard, name='admin_dash'),
    path('professor/', views.professor_dashboard, name='professor_dash'),
    path('student/', views.student_dashboard, name='student_dash'),
]