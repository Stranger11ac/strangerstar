from django.contrib.auth.models import User
from django.urls import reverse

def user_redirect(user):
    if user.is_superuser:
        return reverse('admin_dash')
    if user.groups.filter(name='professor').exists():
        return reverse('professor_dash')
    if user.groups.filter(name='students').exists():
        return reverse('student_dash')
    return reverse('index')
