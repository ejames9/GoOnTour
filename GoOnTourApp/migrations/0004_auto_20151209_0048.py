# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('GoOnTourApp', '0003_auto_20151208_0336'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trip',
            name='showtripper',
        ),
        migrations.DeleteModel(
            name='ShowTripper',
        ),
    ]
