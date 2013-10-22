from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    # url(r'^$', 'core.views.home', name='home'),
    url(r'^', include('dashboard.urls')),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
)
