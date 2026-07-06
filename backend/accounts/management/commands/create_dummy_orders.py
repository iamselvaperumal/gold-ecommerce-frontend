import random
from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import CustomerProfile, JewelryProduct, JewelryOrder

ADDRESS_LINES = [
    "12, Gandhi Street", "45, Anna Nagar Main Road", "8, Bharathi Colony",
    "23, Nehru Street", "67, Kamarajar Salai", "5, Periyar Nagar",
    "34, Sivan Kovil Street", "19, Market Road", "56, VOC Street", "3, Bazaar Street",
]

PAYMENT_METHODS = ['upi', 'debit_card', 'credit_card', 'net_banking', 'cash_on_delivery']
ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

BATCH_SIZE = 300  # how many JewelryOrder rows to insert per DB round-trip


class Command(BaseCommand):
    help = 'Create 2 dummy JewelryOrders (different products) for every dummy customer — FAST bulk version'

    def add_arguments(self, parser):
        parser.add_argument('--orders-per-customer', type=int, default=2)

    def handle(self, *args, **options):
        orders_per_customer = options['orders_per_customer']

        # Only customers who DON'T already have dummy orders (safe to re-run/resume)
        customers = list(
            CustomerProfile.objects.filter(user__email__startswith='dummycustomer')
            .select_related('user')
            .order_by('id')
        )
        if not customers:
            self.stdout.write(self.style.ERROR("No dummy customers found! Run create_dummy_customers first."))
            return

        # Skip customers who already have >= orders_per_customer JewelryOrders (resume support)
        existing_counts = {}
        for row in JewelryOrder.objects.filter(user__email__startswith='dummycustomer').values('user_id'):
            existing_counts[row['user_id']] = existing_counts.get(row['user_id'], 0) + 1

        customers = [c for c in customers if existing_counts.get(c.user_id, 0) < orders_per_customer]

        if not customers:
            self.stdout.write(self.style.SUCCESS("All dummy customers already have orders. Nothing to do."))
            return

        products = list(JewelryProduct.objects.filter(is_active=True).prefetch_related('images'))
        if len(products) < orders_per_customer:
            self.stdout.write(self.style.ERROR(
                f"Only {len(products)} active JewelryProduct rows found. "
                f"Need at least {orders_per_customer}. Add more products in Add Product page first."
            ))
            return

        # Pre-fetch first image url per product (avoid repeated queries)
        product_image_urls = {}
        for p in products:
            first_img = p.images.first()
            product_image_urls[p.id] = first_img.image.url if first_img else ''

        self.stdout.write(self.style.SUCCESS(
            f"{len(customers)} customers still need orders. {len(products)} products available. Starting bulk insert..."
        ))

        batch = []
        created = 0
        total_to_create = len(customers) * orders_per_customer

        # Precompute a safe starting sequence number ONCE (no per-row DB hit)
        from django.utils import timezone
        year = timezone.now().year
        existing_ids = set(
            JewelryOrder.objects.filter(order_id__startswith=f"BBORD{year}")
            .values_list('order_id', flat=True)
        )
        seq_counter = JewelryOrder.objects.count() + 1

        def next_order_id():
            nonlocal seq_counter
            order_id = f"BBORD{year}{seq_counter:06d}"
            while order_id in existing_ids:
                seq_counter += 1
                order_id = f"BBORD{year}{seq_counter:06d}"
            existing_ids.add(order_id)
            seq_counter += 1
            return order_id

        def flush_batch():
            nonlocal batch, created
            if batch:
                JewelryOrder.objects.bulk_create(batch, batch_size=BATCH_SIZE)
                created += len(batch)
                self.stdout.write(self.style.SUCCESS(f"  ...{created}/{total_to_create} orders inserted"))
                batch = []

        for customer in customers:
            chosen_products = random.sample(products, orders_per_customer)

            for product in chosen_products:
                qty = random.randint(1, 2)
                unit_price = float(product.price or 0)
                total_price = round(unit_price * qty, 2)

                order_obj = JewelryOrder(
                    order_id=next_order_id(),  # generated in memory, no DB hit per row
                    user=customer.user,
                    product=product,
                    product_name=product.name,
                    product_metal=product.metal,
                    product_grade=product.grade or '',
                    product_category=product.category,
                    product_image_url=product_image_urls.get(product.id, ''),

                    customer_name=f"{customer.first_name} {customer.last_name}".strip(),
                    customer_phone=customer.mobile_number,
                    customer_alt_phone='',
                    customer_dob=customer.dob,
                    customer_anniversary=customer.anniversary_date,

                    pincode=str(random.randint(600001, 643001)),
                    address_line1=random.choice(ADDRESS_LINES),
                    address_line2=customer.town_name or '',
                    city=customer.city_name,
                    state=customer.state,

                    quantity=qty,
                    unit_price=unit_price,
                    total_price=total_price,

                    payment_method=random.choice(PAYMENT_METHODS),
                    payment_status='paid',
                    status=random.choice(ORDER_STATUSES),
                )
                batch.append(order_obj)

                if len(batch) >= BATCH_SIZE:
                    flush_batch()

        flush_batch()  # flush any remaining

        self.stdout.write(self.style.SUCCESS(f"\nDone! {created} total JewelryOrder rows created."))