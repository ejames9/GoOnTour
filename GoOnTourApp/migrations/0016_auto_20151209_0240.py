# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0015_auto_20151209_0223'),
    ]

    operations = [
        migrations.AddField(
            model_name='showtripper',
            name='coordinates_lat',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='showtripper',
            name='coordinates_lon',
            field=models.FloatField(default=0.0),
        ),
    ]
