from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache
from django.contrib.auth import logout
from django.shortcuts import render


def singuppage(request):
    return render(request, 'singup.html', {})

def forgotten(request):
    logout(request)
    return render(request, 'forgotten.html', {})

@login_required
@never_cache
def indexprofile(request):
    return render(request, 'profile.html', {
        'user':request.user,
    })

