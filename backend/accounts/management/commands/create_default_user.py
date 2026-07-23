import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


User = get_user_model()


class Command(BaseCommand):
    help = 'Create or update the default superadmin account.'

    def handle(self, *args, **kwargs):
        email = os.environ.get(
            'DEFAULT_SUPERADMIN_EMAIL',
            'infisq.senthil@gmail.com',
        ).strip().lower()
        password = os.environ.get('DEFAULT_SUPERADMIN_PASSWORD', 'Senthil@2003')

        user, created = User.objects.get_or_create(email=email)
        user.set_password(password)
        user.role = 'super_admin'
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()

        action = 'created' if created else 'updated'
        self.stdout.write(self.style.SUCCESS(f'Default superadmin {action}: {email}'))
