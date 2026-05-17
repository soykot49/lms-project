from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='last_reminder_at',
            field=models.DateField(blank=True, null=True),
        ),
    ]
