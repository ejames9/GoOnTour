# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0006_auto_20151209_0053'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trip',
            name='showtripper',
        ),
    ]
