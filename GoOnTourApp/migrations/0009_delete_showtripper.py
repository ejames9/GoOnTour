# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0008_auto_20151209_0056'),
    ]

    operations = [
        migrations.DeleteModel(
            name='ShowTripper',
        ),
    ]
