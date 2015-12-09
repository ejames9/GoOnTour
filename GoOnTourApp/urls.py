from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.Home, name='Home'),
    url(r'^test/$', views.Test, name='Test'),
    url(r'^map/$', views.Map, name='Map'),
    url(r'^api_eventful_query_results/$', views.api_eventful_query_results, name='Eventful API'),
    url(r'^api_search_parameters/$', views.api_search_parameters, name='userData API'),
    url(r'^api_flickr_query/$', views.api_flickr_query, name='Flickr API')

]
