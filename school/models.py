from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    insignia = models.CharField(max_length=100, blank=True, null=True)
    first_sesion = models.BooleanField(default=True)
    num_list = models.CharField(max_length=10, blank=True, null=True)
    uid = models.CharField(max_length=30, unique=True, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    team = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.uid or 'No UID'}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
