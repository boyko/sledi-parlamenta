from django.shortcuts import render
from django.views.generic.base import View
from django.http import Http404
from core.models import Person


class ProfileView(View):
    def get(self, request, person_id=False):
        if person_id:
            try:
                person = Person.objects.get(id=int(person_id))
                return render(request, 'profile/view.html', {'person': person})
            except Exception, e:
                print e
                raise Http404
        else:
            items = Person.objects.all()
            return render(request, 'profile/list.html', {'items': items})
