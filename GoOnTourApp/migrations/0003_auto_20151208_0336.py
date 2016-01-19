# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0002_remove_showtripper_coordinates'),
    ]

    operations = [
        migrations.AddField(
            model_name='showtripper',
            name='coordinates_lat',
            field=models.FloatField(default=0.0, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='showtripper',
            name='coordinates_lon',
            field=models.FloatField(default=0.0, null=True, blank=True),
        ),
    ]
