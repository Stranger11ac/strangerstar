from django.contrib.auth.models import Group
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.urls import reverse

def create_newuser(first_name, last_name, username, email, password1, password2=None, is_staff=False, is_active=False):
    if not (password1 and username and email):
        return {'datastatus':False, 'message':'Datos incompletos 😅'}
    if password2 is not None and password1 != password2:
        return {'datastatus':False, 'message':'Las contraseñas no coinciden 😬'}
    if User.objects.filter(username=username).exists():
        return {'datastatus':False, 'message':f'El usuario <u>{username}</u> ya existe. 😯🤔 <br>Te recomiendo utilizar uno distinto', 'valSelector':'usernameSelect'}
    if User.objects.filter(email=email).exists():
        return {'datastatus':False, 'message':f'El correo electrónico <u>{email}</u> ya está registrado 😯<br>Te recomiendo utilizar uno distinto', 'valSelector':'emailSelect'}

    try:
        new_user = User.objects.create_user(
            first_name=first_name.lower(),
            last_name=last_name.lower(),
            username=username,
            email=email,
            password=password1,
            is_staff=is_staff,
            is_active=is_active,
        )
        new_user.save()
        aviso=''
        if password2 is not None:
            aviso = '<br>Tu cuenta está <u>Desactivada</u> 😯😬'
        return {'datastatus': True, 'message': f'Usuario creado exitosamente 🥳🎈 {aviso}'}
    except IntegrityError:
        return {'datastatus': False, 'message': 'Ocurrió un error durante el registro. Intente nuevamente.'}
    

def user_redirect(user):
    if user.is_superuser:
        return reverse('admin_dash')

    if user.groups.filter(name='professor').exists():
        return reverse('professor_dash')

    if user.groups.filter(name='students').exists():
        return reverse('student_dash')

    return reverse('index')
