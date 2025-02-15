from django.shortcuts import render


def singuppage(request):
    return render(request, 'singup.html', {})

