from django.db import models
from core import settings

class Party(models.Model):
    title = models.CharField(max_length=255)
    color = models.CharField(max_length=7)
    logo = models.ImageField(upload_to=settings.MEDIA_ROOT)