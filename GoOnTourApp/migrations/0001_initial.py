# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Query',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='QueryResults',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('result', models.TextField()),
                ('time', models.DateTimeField(null=True)),
                ('query', models.ForeignKey(related_name='entries', to='GoOnTourApp.Query')),
            ],
        ),
        migrations.CreateModel(
            name='SearchParameters',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fav_artist', models.CharField(max_length=20)),
                ('fav_genres', models.CharField(max_length=50)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='ShowTripper',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=15, null=True)),
                ('home', models.CharField(max_length=50, null=True)),
                ('coordinates', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('trip_name', models.CharField(max_length=50)),
                ('travel_radius', models.IntegerField(null=True)),
                ('showtripper', models.ForeignKey(to='GoOnTourApp.ShowTripper')),
            ],
        ),
        migrations.AddField(
            model_name='searchparameters',
            name='trip',
            field=models.ForeignKey(to='GoOnTourApp.Trip', null=True),
        ),
    ]
