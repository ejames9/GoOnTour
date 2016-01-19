# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0011_auto_20151209_0213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='searchparameters',
            name='trip',
            field=models.ForeignKey(to='GoOnTourApp.Trip'),
        ),
    ]
