# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0007_remove_trip_showtripper'),
    ]

    operations = [
        migrations.AlterField(
            model_name='showtripper',
            name='coordinates_lat',
            field=models.FloatField(default=0.0, blank=True),
        ),
        migrations.AlterField(
            model_name='showtripper',
            name='coordinates_lon',
            field=models.FloatField(default=0.0, blank=True),
        ),
    ]
