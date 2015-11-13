from django.db import models
import datetime
from django.utils import timezone


class Roadi(models.Model):
    home_address = models.CharField(max_length=50)


    def __str__(self):
        return self.home_address

    def __unicode__(self):
        return self.home_address

class Trip(models.Model):
    roadi = models.ForeignKey(Roadi)
    trip_name = models.CharField(max_length=50)
    travel_radius = models.IntegerField(null=True)
    travel_states = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    bands = models.CharField(max_length=200)

    def __str__(self):
        return self.trip_name

    def __unicode__(self):
        return self.trip_name

class Query(models.Model):
    text = models.CharField(max_length=50)

    def __str__(self):
        return self.text

    def __unicode__(self):
        return self.text


class QueryResults(models.Model):
    query = models.ForeignKey(Query, related_name='entries')
    result = models.TextField()
    time = models.DateTimeField(null=True)

    def __str__(self):
        return self.result

    def __unicode__(self):
        return self.result
