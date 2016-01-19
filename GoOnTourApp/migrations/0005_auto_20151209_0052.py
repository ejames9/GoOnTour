# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0004_auto_20151209_0048'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShowTripper',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=15, null=True)),
                ('home', models.CharField(max_length=50, null=True)),
                ('coordinates_lat', models.FloatField(default=0.0, null=True, blank=True)),
                ('coordinates_lon', models.FloatField(default=0.0, null=True, blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='trip',
            name='showtripper',
            field=models.ForeignKey(default=0.0, to='GoOnTourApp.ShowTripper'),
        ),
    ]
