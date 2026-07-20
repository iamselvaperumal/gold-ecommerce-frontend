# Generated manually for product collection navbar category support.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0029_jewelryorder_razorpay_order_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jewelryproduct',
            name='category',
            field=models.CharField(
                choices=[
                    ('rings', 'Rings'),
                    ('necklaces', 'Necklaces'),
                    ('bangles', 'Bangles'),
                    ('bracelets', 'Bracelets'),
                    ('earrings', 'Earrings'),
                    ('chains', 'Chains'),
                    ('pendants', 'Pendants'),
                    ('mangalsutra', 'Mangalsutra'),
                    ('anklets', 'Anklets'),
                    ('nosepin', 'Nose Pin'),
                    ('toerings', 'Toe Rings'),
                    ('cufflinks', 'Cufflinks'),
                    ('brooches', 'Brooches'),
                    ('tiepins', 'Tie Pins'),
                    ('coins', 'Coins'),
                ],
                max_length=20,
            ),
        ),
    ]
