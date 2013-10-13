from django.db import models

class MP(models.Model):
    party = models.CharField(max_length=255)