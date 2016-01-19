from django.db import models
import datetime
from django.utils import timezone


class ShowTripper(models.Model):
    name = models.CharField(max_length=15, null=True)
    home = models.CharField(max_length=50, null=True)
    coordinates_lat = models.FloatField()
    coordinates_lon = models.FloatField()

    def __str__(self):
        return str(self.id)

    def __unicode__(self):
        return str(self.id)


class Trip(models.Model):
    showtripper = models.ForeignKey(ShowTripper)
    trip_name = models.CharField(max_length=50)
    travel_radius = models.IntegerField(null=True)

    def __str__(self):
        return self.trip_name

    def __unicode__(self):
        return self.trip_name


class SearchParameters(models.Model):
    trip = models.ForeignKey(Trip)
    fav_artist = models.CharField(max_length=20)
    fav_genres = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        if trip:
            return self.trip_name
        else:
            return fav_artist + ', ' + fav_genres + ': ' + start_date + '-' + end_date

    def __unicode__(self):
        if trip:
            return self.trip_name
        else:
            return fav_artist + ', ' + fav_genres + ': ' + start_date + '-' + end_date



class Query(models.Model):
    text = models.CharField(max_length=50)

    def __str__(self):
        return self.text

    def __unicode__(self):
        return self.text


class QueryResults(models.Model):
    query = models.ForeignKey(Query, related_name='entries')
    result = models.TextField()
    # time = models.DateTimeField(null=True)

    def __str__(self):
        return self.result

    def __unicode__(self):
        return self.result
