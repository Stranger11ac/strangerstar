from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.db import IntegrityError
from .models import UserProfile
from functools import wraps

def create_newuser(first_name, last_name, username, email, password1, password2=None, is_staff=False, is_active=False, group=None, group_class=None, num_list=None, uid=None, notes=None):
    if not (password1 and username and email):
        return {'datastatus': False, 'message': 'Datos incompletos 😅'}
    if password2 is not None and password1 != password2:
        return {'datastatus': False, 'message': 'Las contraseñas no coinciden 😬'}
    if User.objects.filter(username=username).exists():
        return {'datastatus': False, 'message': f'El usuario <u>{username}</u> ya existe. 😯🤔 <br>Te recomiendo utilizar uno distinto', 'valSelector': 'usernameSelect'}
    if User.objects.filter(email=email).exists():
        return {'datastatus': False, 'message': f'El correo electrónico <u>{email}</u> ya está registrado 😯<br>Te recomiendo utilizar uno distinto', 'valSelector': 'emailSelect'}

    try:
        if group not in ['admin', 'professor', 'student']:
            group = 'student'

        # Crear usuario
        new_user = User.objects.create_user(
            first_name=first_name.lower(),
            last_name=last_name.lower(),
            username=username,
            email=email,
            password=password1,
            is_staff=is_staff,
            is_active=is_active,
            groups=[group]  # Asignar el grupo al usuario
        )
        new_user.save()

        # Actualizar UserProfile con los nuevos campos
        user_profile = UserProfile.objects.get(user=new_user)
        user_profile.group_class = group_class
        user_profile.num_list = num_list
        user_profile.uid = uid
        user_profile.notes = notes
        user_profile.save()

        aviso = ''
        if password2 is not None:
            aviso = '<br>Tu cuenta está <u>Desactivada</u> 😯😬'
        return {'datastatus': True, 'message': f'Usuario creado exitosamente 🥳🎈 {aviso}'}
    
    except IntegrityError:
        return {'datastatus': False, 'message': 'Ocurrió un error durante el registro. Intente nuevamente.'}

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
