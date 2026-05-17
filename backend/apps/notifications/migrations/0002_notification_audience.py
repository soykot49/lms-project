from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='audience',
            field=models.CharField(
                choices=[('member', 'Member'), ('staff', 'Staff')],
                default='member',
                max_length=10,
            ),
        ),
    ]
