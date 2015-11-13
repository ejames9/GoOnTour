"""go_on_tour URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from GoOnTourApp import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', include('GoOnTourApp.urls')),
    url(r'^test/$', views.Test, name='Test'),
    url(r'^map/$', views.Map, name='Map'),
    url(r'^api_eventful_query_results/$', views.api_eventful_query_results, name='Eventful API'),
    url(r'^api_flickr_query/$', views.api_flickr_query, name='Flickr API')
    # url(r'^(?P<question_id>[0-9]+)/vote/$', views.vote, name='vote'),
]
