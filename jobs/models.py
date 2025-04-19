from django.db import models

class settings(models.Model):
    name = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='settings/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Configuración'
        verbose_name_plural = 'Configuraciones'
