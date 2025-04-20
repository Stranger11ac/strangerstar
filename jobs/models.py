from django.db import models

class settings(models.Model):
    name = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='settings/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    uid = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Configuración'
        verbose_name_plural = 'Configuraciones'

class gallery(models.Model):
    image = models.ImageField(upload_to='gallery/', blank=True, null=True)
    uid = models.ForeignKey(settings, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.uid

    class Meta:
        verbose_name = 'Galería'
        verbose_name_plural = 'Galerías'