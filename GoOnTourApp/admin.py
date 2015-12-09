from django.contrib import admin
from .models import Trip, Query, QueryResults, ShowTripper, SearchParameters

admin.site.register(Trip)
admin.site.register(ShowTripper)
admin.site.register(QueryResults)
admin.site.register(Query)
admin.site.register(SearchParameters)
