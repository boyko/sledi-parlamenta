from django.shortcuts import render
from django.views.generic.base import View


class HomeView(View):
    def get(self, request):
        return render(request, 'home/get.html', {})

    def put(self, request):
        return render(request, 'home/put.html', {})