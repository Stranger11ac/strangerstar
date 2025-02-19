from django.contrib import admin
from .models import Theclass, Classhomework, Classexams, Classassitens, Classevents, UserProfile

admin.site.register(Theclass)
admin.site.register(Classhomework)
admin.site.register(Classexams)
admin.site.register(Classassitens)
admin.site.register(Classevents)
admin.site.register(UserProfile)
