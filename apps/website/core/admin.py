from django.contrib import admin
from core.models import Person, Structure


class RepresentativeInline(admin.TabularInline):
    model = Structure.members.through
    extra = 1


class PersonAdmin(admin.ModelAdmin):
    inlines = [
        RepresentativeInline,
    ]
admin.site.register(Person, PersonAdmin)


class StructureAdmin(admin.ModelAdmin):
    inlines = [
        RepresentativeInline,
    ]
admin.site.register(Structure, StructureAdmin)