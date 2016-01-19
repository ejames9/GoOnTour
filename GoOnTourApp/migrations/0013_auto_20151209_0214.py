# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0012_auto_20151209_0213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='showtripper',
            name='coordinates_lat',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='showtripper',
            name='coordinates_lon',
            field=models.FloatField(default=0.0),
        ),
    ]
