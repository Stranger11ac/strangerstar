from django.views.decorators.cache import never_cache
from django.contrib.auth import logout
from .functions import group_required
from django.shortcuts import render

def singuppage(request):
    return render(request, 'singup.html', {})

def forgotten(request):
    logout(request)
    return render(request, 'forgotten.html', {})

@never_cache
@group_required('admin')
def admin_dashboard(request):
    return render(request, 'admin_dash.html', {
        'user': request.user,
    })

@never_cache
@group_required('professor')
def professor_dashboard(request):
    return render(request, 'professor_dash.html', {
        'user': request.user,
    })

@never_cache
@group_required('students')
def student_dashboard(request):
    return render(request, 'student_dash.html', {
        'user': request.user,
    })
