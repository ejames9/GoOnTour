# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0016_auto_20151209_0240'),
    ]

    operations = [
        migrations.AlterField(
            model_name='showtripper',
            name='coordinates_lat',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='showtripper',
            name='coordinates_lon',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='trip',
            name='travel_radius',
            field=models.IntegerField(null=True),
        ),
    ]
