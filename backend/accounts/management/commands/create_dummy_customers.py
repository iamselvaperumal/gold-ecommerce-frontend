import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from accounts.models import User, PromotorProfile, CustomerProfile


FIRST_NAMES = [
    'Arun', 'Karthik', 'Vignesh', 'Prakash', 'Suresh', 'Ramesh', 'Vijay',
    'Senthil', 'Mani', 'Rajesh', 'Ganesh', 'Anand', 'Bala', 'Dinesh',
    'Elango', 'Gopal', 'Hari', 'Ilango', 'Jagan', 'Kannan', 'Loganathan',
    'Muthu', 'Naveen', 'Prasanna', 'Raja', 'Saravanan',
    'Tamil', 'Uday', 'Vasanth', 'Selvam', 'Dhanraj', 'Jai',
]

FATHER_NAMES = [
    'Ramesh', 'Rajasekar', 'Elangovan', 'Muthuraman', 'Chandrasekar',
    'Palaniappan', 'Govindaraj', 'Krishnamurthy', 'Sivakumar', 'Balasubramaniam',
    'Natarajan', 'Subramaniam', 'Manikandan', 'Selvaraj', 'Kaliyaperumal',
    'Duraisamy', 'Venkatesan', 'Perumal', 'Ganapathy', 'Rajendran',
]

CITIES = [
    ('Chennai', 'Chennai', 'Tamil Nadu'),
    ('Coimbatore', 'Coimbatore', 'Tamil Nadu'),
    ('Madurai', 'Madurai', 'Tamil Nadu'),
    ('Trichy', 'Tiruchirappalli', 'Tamil Nadu'),
    ('Salem', 'Salem', 'Tamil Nadu'),
    ('Erode', 'Erode', 'Tamil Nadu'),
    ('Vellore', 'Vellore', 'Tamil Nadu'),
    ('Tirunelveli', 'Tirunelveli', 'Tamil Nadu'),
    ('Namakkal', 'Namakkal', 'Tamil Nadu'),
    ('Karur', 'Karur', 'Tamil Nadu'),
]

INITIALS = ['S', 'K', 'M', 'A', 'R', 'V', 'P', 'G', 'D', 'T']

OCCUPATION_DETAILS = {
    'employee': ['Private Employee', 'Government Employee', 'Daily Wage Worker'],
    'business': ['Small Shop Owner', 'Local Trader', 'Vendor'],
    'others': ['Housewife', 'Student', 'Retired'],
}

DUMMY_PASSWORD = "Senthil@2026"


def random_dob():
    days_old = random.randint(18 * 365, 60 * 365)
    return date.today() - timedelta(days=days_old)


def random_anniversary(dob):
    days_after_marriage = random.randint(1 * 365, 20 * 365)
    return dob + timedelta(days=18 * 365 + days_after_marriage)


class Command(BaseCommand):
    help = 'Create dummy Customer users, evenly distributed across all Promotors'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=3200, help='Total number of dummy customers to create')

    def handle(self, *args, **options):
        count = options['count']
        created = 0

        # ── Step 1: Fetch all promotors ──
        promotors = list(PromotorProfile.objects.all())
        if not promotors:
            self.stdout.write(self.style.ERROR("No promotors found! Create promotors first."))
            return

        total_promotors = len(promotors)
        self.stdout.write(self.style.SUCCESS(f"Found {total_promotors} promotors. Distributing {count} customers among them..."))

        for i in range(1, count + 1):
            # ── Round-robin: customer i goes to promotor (i % total_promotors) ──
            promotor = promotors[(i - 1) % total_promotors]

            first_name = random.choice(FIRST_NAMES)
            father_name = random.choice(FATHER_NAMES)
            initial = random.choice(INITIALS)
            city, district, state = random.choice(CITIES)

            email = f"dummycustomer{i}@bitbyte.test"

            if User.objects.filter(email=email).exists():
                self.stdout.write(self.style.WARNING(f"Skip: {email} already exists"))
                continue

            mobile = f"9{random.randint(100000000, 999999999)}"
            aadhaar = str(random.randint(100000000000, 999999999999))
            # ✅ Safe 10-char PAN, works for any i (1 to 9999)
            pan = f"CU{i:04d}{random.randint(1000, 9999)}"

            occupation = random.choice(['employee', 'business', 'others'])
            occupation_detail = random.choice(OCCUPATION_DETAILS[occupation])

            dob = random_dob()
            married_status = random.choice(['single', 'married'])
            anniversary_date = random_anniversary(dob) if married_status == 'married' else None

            user = User.objects.create_user(
                email=email,
                password=DUMMY_PASSWORD,
                role='customer',
            )

            CustomerProfile.objects.create(
                user=user,
                created_by=promotor.user,          # Promotor created this customer
                assigned_promotor=promotor,        # ✅ Links customer to promotor for hierarchy
                initial=initial,
                first_name=first_name,
                last_name=father_name,
                mobile_number=mobile,
                gender=random.choice(['male', 'female']),
                dob=dob,
                married_status=married_status,
                anniversary_date=anniversary_date,
                door_no=f"{random.randint(1, 200)}",
                street_name="Main Street",
                town_name=city,
                city_name=city,
                district=district,
                state=state,
                aadhaar_no=aadhaar,
                pan_no=pan,
                occupation=occupation,
                occupation_detail=occupation_detail,
                annual_salary=str(random.randint(80000, 350000)),
            )

            created += 1
            self.stdout.write(self.style.SUCCESS(
                f"Created: {email} -> assigned to Promotor {promotor.promotor_id} ({promotor.first_name})"
            ))

        self.stdout.write(self.style.SUCCESS(f"\nDone! {created} dummy customers created and linked to {total_promotors} promotors."))