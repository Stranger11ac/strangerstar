from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from django.shortcuts import redirect
from django.db import IntegrityError
from .models import UserProfile
from functools import wraps

def create_newuser(first_name, last_name, username, password1, email=None, password2=None, is_staff=False, is_active=False, group=None, insignia=None, num_list=None, uid=None):
    try:
        allowed_groups = ['admin', 'professor', 'student']
        group = group if group in allowed_groups else 'student'

        if User.objects.filter(username=username).exists():
            return {'datastatus': False, 'message': 'El nombre de usuario ya está en uso. Prueba con otro.'}

        if email and User.objects.filter(email=email).exists():
            return {'datastatus': False, 'message': 'El correo electrónico ya está registrado. Usa otro o inicia sesión.'}

        is_superuser = (group == 'admin')
        if is_superuser:
            is_staff = True

        if group not in ['admin', 'professor', 'student']:
            group = 'student'

        # Crear usuario
        new_user = User.objects.create_user(
            first_name = first_name.strip().lower(),
            last_name = last_name.strip().lower(),
            username = username.strip(),
            email = email.strip(),
            password = password1,
            is_staff = is_staff,
            is_active = is_active,
            is_superuser = is_superuser
        )
        new_user.save()

        # Actualizar UserProfile con los nuevos campos
        user_profile = UserProfile.objects.get(user=new_user)
        user_profile.insignia = insignia
        user_profile.num_list = num_list
        user_profile.uid = uid
        user_profile.save()

        if not Group.objects.filter(name=group).exists():
            group_obj = Group.objects.create(name=group)
        else:
            group_obj = Group.objects.get(name=group)

        new_user.groups.add(group_obj)

        aviso = ''
        if password2 is not None:
            aviso = '<br>Tu cuenta está <u>Desactivada</u> 😯😬'
        return {'datastatus': True, 'message': f'Usuario creado exitosamente 🥳🎈 {aviso}'}
    
    except IntegrityError:
            return {'datastatus': False, 'message': 'Error de integridad en la base de datos. Posible duplicado de datos.'}

    except Exception as e:
        return {'datastatus': False, 'message': f'Ocurrió un error inesperado: {str(e)}'}

def group_required(group_name):
    """
    Decorador para restringir el acceso a usuarios que pertenezcan a un grupo específico.
    """
    def decorator(view_func):
        @wraps(view_func)
        @login_required
        def _wrapped_view(request, *args, **kwargs):
            if request.user.groups.filter(name=group_name).exists() or request.user.is_superuser:
                return view_func(request, *args, **kwargs)
            return redirect('singout')
        return _wrapped_view
    return decorator
