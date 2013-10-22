from django.conf.urls import patterns, include, url

from dashboard.views import home

urlpatterns = patterns('',
    url(r'^', home.HomeView.as_view()),
)
