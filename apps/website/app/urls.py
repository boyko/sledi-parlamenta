from django.conf.urls import patterns, include, url

from dashboard.views import mps, home

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', home.HomeView.as_view(), name='home'),
    url(r'^mps/$', mps.MpsView.as_view(), name='mps'),
	url(r'^admin/', include(admin.site.urls)),
)
