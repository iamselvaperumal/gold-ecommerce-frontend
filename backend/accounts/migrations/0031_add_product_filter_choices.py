# Generated manually to keep product filter choices aligned with the frontend catalog filters.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0030_expand_jewelryproduct_categories'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jewelryproduct',
            name='tag',
            field=models.CharField(
                blank=True,
                choices=[
                    ('Bestseller', 'Bestseller'),
                    ('Bridal', 'Bridal'),
                    ('Premium', 'Premium'),
                    ('Statement', 'Statement'),
                    ('Stackable', 'Stackable'),
                    ('New', 'New'),
                    ('Limited', 'Limited'),
                    ('', 'N/A'),
                ],
                max_length=50,
            ),
        ),
        migrations.AlterField(
            model_name='jewelryproduct',
            name='occasion',
            field=models.CharField(
                blank=True,
                choices=[
                    ('Wedding', 'Wedding'),
                    ('Birthday', 'Birthday'),
                    ('Anniversary', 'Anniversary'),
                    ('Auspicious', 'Auspicious'),
                    ('Office Wear', 'Office Wear'),
                    ('Modern Wear', 'Modern Wear'),
                    ('Casual Wear', 'Casual Wear'),
                    ('Traditional Wear', 'Traditional Wear'),
                    ('', 'N/A'),
                ],
                max_length=50,
            ),
        ),
        migrations.AlterField(
            model_name='jewelryproduct',
            name='wedding_category',
            field=models.CharField(
                blank=True,
                choices=[
                    ('Wedding Ring', 'Wedding Ring'),
                    ('Wedding Necklaces', 'Wedding Necklaces'),
                    ('Wedding Chain', 'Wedding Chain'),
                    ('Wedding Bangles', 'Wedding Bangles'),
                    ('Wedding Earring', 'Wedding Earring'),
                    ('', 'N/A'),
                ],
                max_length=50,
            ),
        ),
    ]
