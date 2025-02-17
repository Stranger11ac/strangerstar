from django.shortcuts import render


def singuppage(request):
    return render(request, 'singup.html', {})

def indexprofile(request):
    return render(request, 'profile.html', {
        'user':request.user,
    })

