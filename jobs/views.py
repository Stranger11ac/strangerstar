from django.shortcuts import render


def index(request):
    return render(request, 'index.html', {})

def jobs(request):
    return render(request, 'jobs.html', {})

