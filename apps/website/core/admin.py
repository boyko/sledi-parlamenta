from django.contrib import admin
from core.models import Person, Party


class RepresentativeInline(admin.TabularInline):
    model = Party.members.through
    extra = 1


class PersonAdmin(admin.ModelAdmin):
    inlines = [
        RepresentativeInline,
    ]
admin.site.register(Person, PersonAdmin)


class PartyAdmin(admin.ModelAdmin):
    inlines = [
        RepresentativeInline,
    ]
admin.site.register(Party, PartyAdmin)