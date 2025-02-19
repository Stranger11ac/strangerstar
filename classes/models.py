from django.contrib.auth.models import User
from django.db import models

class Theclass(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    professor = models.CharField(max_length=100)
    students = models.TextField(null=True, blank=True)

    def __str__(self):
        return super().__str__()

class Classhomework(models.Model):
    name = models.CharField(max_length=100)
    indications = models.TextField(null=False)
    date_start = models.DateTimeField(null=False)
    date_end = models.DateTimeField(null=False)
    class_name = models.TextField(null=True, blank=True)
    students = models.TextField(null=True, blank=True)

class Classexams(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    questions = models.TextField(null=True, blank=True)
    students = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=False)

class Classassitens(models.Model):
    class_name = models.CharField(max_length=100)
    date = models.DateTimeField()
    students = models.TextField(null=True, blank=True)
    is_here = models.BooleanField(default=False)

class Classevents(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    url = models.TextField(blank=True, null=True)
    frecuenci = models.IntegerField(default=0)
    date_start = models.DateTimeField(blank=True, null=True)
    date_end = models.DateTimeField(blank=True, null=True)
    is_all_day = models.BooleanField(default=False)
    style_name = models.CharField(max_length=100, blank=True, null=True, default='event_detail')

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    password_update = models.DateField(blank=True, null=True)
    location = models.TextField(null=True, blank=True)
