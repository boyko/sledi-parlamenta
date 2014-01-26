from django.conf.urls import patterns, url

from profiles.views import main

urlpatterns = patterns(
    '',
    url(r'(?P<person_id>[\w-].*)', main.ProfileView.as_view()),
    url(r'$', main.ProfileView.as_view()),
)

