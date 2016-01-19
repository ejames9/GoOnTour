# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0013_auto_20151209_0214'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='queryresults',
            name='time',
        ),
        migrations.AlterField(
            model_name='trip',
            name='travel_radius',
            field=models.IntegerField(default=0.0),
        ),
    ]
