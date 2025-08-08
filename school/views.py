from .functions import group_required, create_newuser, icons_list
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from django.contrib.auth import logout
from django.http import JsonResponse
from django.shortcuts import render
from .models import UserProfile
from datetime import datetime

# Administracion ----------------------------------------------------------
def forgotten(request):
    logout(request)
    return render(request, 'forgotten.html', {})

@never_cache
def singup(request):
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        first_name_post = (request.POST.get('first_name') or '').strip().lower()
        last_name_post = (request.POST.get('last_name') or '').strip().lower()
        num_list_raw = request.POST.get('num_list') or ''
        num_list_post = num_list_raw[:10]
        insignia_post = request.POST.get('insignia')
        group_post = request.POST.get('rol')

        try:
            num_list_int = int(num_list_post) if num_list_post != '' else None
        except (ValueError, TypeError):
            num_list_int = None

        if insignia_post:
            existing_numbers_qs = UserProfile.objects.filter(insignia=insignia_post).values_list('num_list', flat=True)
            existing_numbers = [n for n in existing_numbers_qs if n is not None]
            if existing_numbers and num_list_int is not None:
                print(f"Existing numbers for insignia '{insignia_post}':{existing_numbers} - ({num_list_int})")

                if num_list_int in existing_numbers:
                    num_list_int = int(max(existing_numbers, default=0)) + 1

        # proteger split()[0] frente a strings vacíos
        fn0 = first_name_post.split()[0] if first_name_post.split() else first_name_post
        ln0 = last_name_post.split()[0] if last_name_post.split() else last_name_post
        password_new = fn0 + ln0 + (str(num_list_int) if num_list_int is not None else '')

        user_new = request.POST.get('username')
        now = datetime.today().strftime('%Y%m%d')
        nowtime = datetime.now().strftime('%H%M%S')

        if not user_new:
            user_new = fn0 + ln0 + (str(num_list_int) if num_list_int is not None else '')
            if group_post != 'student':
                user_new = user_new + str(nowtime)

        uid_new = first_name_post[:5] + (str(num_list_int) if num_list_int is not None else '') + str(insignia_post) + now

        response = create_newuser(
            first_name = first_name_post,
            last_name = last_name_post,
            username = user_new,
            email = request.POST.get('email'),
            password1 = password_new,
            is_active = request.POST.get('is_active') in ['true', '1', 'True', 'on'],
            group = group_post,
            insignia = insignia_post,
            num_list = num_list_int if group_post == 'student' else None,
            uid = uid_new
        )
        
        status = 200 if response.get('datastatus') else 400
        return JsonResponse(response, status=status)

def singuppage(request):
    return render(request, 'singup.html', {})

@never_cache
@group_required('admin')
def admin_dashboard(request):
    users_objects = User.objects.all().order_by('-id').select_related('userprofile').prefetch_related('groups')
    get_icons_list = icons_list()
    return render(request, 'dash_admin.html', {
        'user': request.user,
        'users_list': users_objects,
        'icons_list': get_icons_list,
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
def user_get_data(request):
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
    return JsonResponse({"datastatus": False, "message": "Solicitud inválida"}, status=400)

@never_cache
@group_required('admin')
def user_update(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        user = get_object_or_404(User, id=user_id)
        
        rol_post = request.POST.get("rol")
        first_name_post = request.POST.get("first_name")
        last_name_post = request.POST.get("last_name")
        email_post = request.POST.get("email")
        username_post = request.POST.get("username")
        insignia_post = request.POST.get("insignia")
        num_list_post = request.POST.get("num_list")[:10]
        uid_post = request.POST.get("up_uid")

        if first_name_post:
            user.first_name = first_name_post.lower()
        if last_name_post:
            user.last_name = last_name_post.lower()
        if email_post:
            user.email = email_post.lower()
        if username_post:
            user.username = username_post.lower()
        if insignia_post:
            user.userprofile.insignia = insignia_post.lower()
        if num_list_post:
            user.userprofile.num_list = num_list_post.lower()
        if uid_post:
            user.userprofile.uid = uid_post
        else:
            now = datetime.today().strftime('%Y%m%d')
            uid_new = first_name_post[:5] + (str(num_list_post) if num_list_post else '') + str(insignia_post) + now
            user.userprofile.uid = uid_new
        
        if rol_post:
            rol = rol_post.lower()
            user.groups.clear()
            try:
                if rol == "admin":
                    admin_group = Group.objects.get(name="admin")
                    user.groups.add(admin_group)
                elif rol == "systems":
                    systems_group = Group.objects.get(name="systems")
                    user.groups.add(systems_group)
                elif rol == "student":
                    student_group = Group.objects.get(name="student")
                    user.groups.add(student_group)
                elif rol == "professor":
                    professor_group = Group.objects.get(name="professor")
                    user.groups.add(professor_group)
                else:
                    return JsonResponse({"datastatus": False, "message": "Rol inválido."})
            except Group.DoesNotExist:
                return JsonResponse({"datastatus": False, "message": "Grupo no encontrado."})
        
        user.save()
        user.userprofile.save()
        
        return JsonResponse({"datastatus": True, "message": f"Usuario {username_post} actualizado correctamente."})
    
    return JsonResponse({"datastatus": False, "message": "Solicitud inválida."})

@never_cache
@group_required('admin')
def user_delete(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        user = get_object_or_404(User, id=user_id)
        user.delete()
        return JsonResponse({"datastatus": True, "message": f"Usuario {user.username} eliminado correctamente."})
    return JsonResponse({"datastatus": False, "message": "Solicitud inválida."})

@never_cache
@group_required('admin')
def user_active(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        user = get_object_or_404(User, id=user_id)

        is_active_post = request.POST.get("is_active") in ['true', '1', 'True', 'on']
        user.is_active = is_active_post
        user.save()
        user.userprofile.save()

        isactive = "Desactivado"
        if is_active_post:
            isactive = "Activado"
        
        return JsonResponse({"datastatus": True, "message": f"Usuario {user.username} {isactive}."})
    
    return JsonResponse({"datastatus": False, "message": "Solicitud inválida."})