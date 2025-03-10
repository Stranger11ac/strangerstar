from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.cache import never_cache
from django.contrib.auth.models import User
from .functions import user_redirect
from django.shortcuts import render
from django.urls import reverse

def index(request):
    logout(request)
    return render(request, 'index.html', {})

def weather_app(request):
    return render(request, 'weather.html', {})
def spin_app(request):
    return render(request, 'spin.html', {})

# Administracion ----------------------------------------------------------
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
