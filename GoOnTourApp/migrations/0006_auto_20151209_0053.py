# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0005_auto_20151209_0052'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='showtripper',
            field=models.ForeignKey(default=0, to='GoOnTourApp.ShowTripper'),
        ),
    ]
