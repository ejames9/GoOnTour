# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0010_auto_20151209_0107'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='showtripper',
            field=models.ForeignKey(to='GoOnTourApp.ShowTripper'),
        ),
    ]
