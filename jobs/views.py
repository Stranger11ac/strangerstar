from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from .functions import create_newuser, user_redirect
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.shortcuts import render
from django.urls import reverse

def index(request):
    logout(request)
    return render(request, 'index.html', {})

def jobicons(request):
    return render(request, 'icons.html', {})

# Administracion ----------------------------------------------------------
@login_required
@never_cache
def singup(request):
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        response = create_newuser(
            first_name=request.POST.get('first_name'),
            last_name=request.POST.get('last_name'),
            username=request.POST.get('username'),
            email=request.POST.get('email'),
            password1=request.POST.get('password1'),
            password2=request.POST.get('password2'),
            is_active = request.POST.get('is_active') in ['true', '1', 'True', 'on']
        )
        
        status = 200 if response['datastatus'] else 400
        return JsonResponse(response, status=status)

@never_cache
def singin(request):
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        login_identifier = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user = User.objects.get(username=login_identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=login_identifier)
            except User.DoesNotExist:
                return JsonResponse({'datastatus': False, 'message': 'Usuario no registrado 😅. Verifica tu nombre de usuario o correo electrónico.'}, status=400)

        if not user.is_active:
            return JsonResponse({'datastatus': False, 'message': '🧐😥😯 UPS! <br> Al parecer tu cuenta está <u>Desactivada</u>. Será activada si estás autorizado'}, status=400)

        authenticated_user = authenticate(request, username=user.username, password=password)
        if authenticated_user is None:
            return JsonResponse({'datastatus': False, 'message': 'Contraseña incorrecta. Por favor, inténtalo de nuevo.'}, status=400)

        login(request, authenticated_user)
        redirect_url = user_redirect(authenticated_user)
        return JsonResponse({'datastatus': True, 'redirect_url': redirect_url})

    logout(request)
    url = reverse('index') + '#tabLogin'
    return HttpResponseRedirect(url)

@never_cache
def singout(request):
    logout(request)
    url = reverse('index') + '#tabLogin'
    return HttpResponseRedirect(url)
