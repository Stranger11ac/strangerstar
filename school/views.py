from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from .functions import group_required, create_newuser
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.http import JsonResponse
from django.shortcuts import render
from datetime import datetime

def forgotten(request):
    logout(request)
    return render(request, 'forgotten.html', {})

# Administracion ----------------------------------------------------------
@login_required
@never_cache
def singup(request):
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        first_name_post = request.POST.get('first_name')
        num_list_post = request.POST.get('num_list')
        last_name_post = request.POST.get('last_name')
        insignia_post = request.POST.get('insignia')
        password_new = first_name_post.split()[0].lower() + last_name_post.split()[0].lower() + (str(num_list_post) if num_list_post else '')

        user_new = request.POST.get('username')
        fecha_actual = datetime.today().strftime('%Y%m%d')

        if not user_new:
            user_new = first_name_post.split()[0].lower() + last_name_post.split()[0].lower() + str(num_list_post)
        
        uid_new = first_name_post.split()[0].lower() + (str(num_list_post) if num_list_post else '') + str(insignia_post) + fecha_actual

        response = create_newuser(
            first_name = first_name_post,
            last_name = last_name_post,
            username = user_new,
            email = request.POST.get('email'),
            password1 = password_new,
            is_active = request.POST.get('is_active') in ['true', '1', 'True', 'on'],
            group = request.POST.get('rol'),
            insignia = insignia_post,
            num_list = num_list_post,
            uid = uid_new
        )
        
        status = 200 if response['datastatus'] else 400
        return JsonResponse(response, status=status)

def singuppage(request):
    return render(request, 'singup.html', {})

@never_cache
@group_required('admin')
def admin_dashboard(request):
    users_objects = User.objects.all().order_by('-id').select_related('userprofile').prefetch_related('groups')
    return render(request, 'dash_admin.html', {
        'user': request.user,
        'users_list': users_objects,
    })

@never_cache
@group_required('professor')
def professor_dashboard(request):
    return render(request, 'dash_professor.html', {
        'user': request.user,
    })

@never_cache
@group_required('students')
def student_dashboard(request):
    return render(request, 'dash_student.html', {
        'user': request.user,
    })

@never_cache
@group_required('admin')
def get_user_data(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        user = get_object_or_404(User, id=user_id)
        data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email": user.email,
            "rol": user.groups.values_list("name", flat=True).first(),
            "uid": user.userprofile.uid if hasattr(user, "userprofile") else "",
            "insignia": user.userprofile.insignia if hasattr(user, "userprofile") else "",
            "num_list": user.userprofile.num_list if hasattr(user, "userprofile") else "",
        }
        return JsonResponse(data)
    return JsonResponse({"error": "Solicitud inválida"}, status=400)
