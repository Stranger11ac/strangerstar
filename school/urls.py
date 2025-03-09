from django.urls import path
from . import views

urlpatterns = [
    path("", views.forgotten, name="forgotten"),
    path("singup/", views.singup, name="singup"),
    path("singup_test/", views.singuppage, name="singuppage"),
    
    path('admin/', views.admin_dashboard, name='admin_dash'),
    path('professor/', views.professor_dashboard, name='professor_dash'),
    path('student/', views.student_dashboard, name='student_dash'),

    path('user_get/', views.user_get_data, name='user_get_data'),
    path('user_update/', views.user_update, name='user_update'),
    path('user_delete/', views.user_delete, name='user_delete'),
    path('user_active/', views.user_active, name='user_active'),
]