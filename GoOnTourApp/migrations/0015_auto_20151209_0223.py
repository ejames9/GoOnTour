# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0014_auto_20151209_0219'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='showtripper',
            name='coordinates_lat',
        ),
        migrations.RemoveField(
            model_name='showtripper',
            name='coordinates_lon',
        ),
    ]
