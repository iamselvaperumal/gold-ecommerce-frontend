from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from .models import User, AdminProfile, DealerProfile, SubDealerProfile, PromotorProfile, CustomerProfile, Announcement, AnnouncementReply, ProfileUpdateRequest, MetalRate, MetalOrder, JewelryProduct, JewelryProductImage, HomeBanner, CartItem, Wishlist
from .serializers import *
from django.utils import timezone
from datetime import timedelta


def get_user_profile_id(user):
    """Returns the user's role-specific ID string."""
    try:
        role_map = {
            'admin':      ('admin_profile',      'admin_id'),
            'dealer':     ('dealer_profile',     'dealer_id'),
            'sub_dealer': ('sub_dealer_profile', 'sub_dealer_id'),
            'promotor':   ('promotor_profile',   'promotor_id'),
            'customer':   ('customer_profile',   'customer_id'),
        }
        if user.role in role_map:
            profile_attr, id_field = role_map[user.role]
            p = getattr(user, profile_attr)
            return getattr(p, id_field)
    except Exception:
        pass
    return None

def is_user_mentioned_in_title(title, user):
    """Check if user's ID appears in the announcement title."""
    user_id = get_user_profile_id(user)
    if not user_id:
        return False
    return user_id in title

    

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': user.role,
                'email': user.email,
            })
        return Response({'error': 'Invalid credentials'}, status=400)


class CreateAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        serializer = AdminProfileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Admin created successfully'}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        admins = AdminProfile.objects.all()
        serializer = AdminListSerializer(admins, many=True)
        return Response(serializer.data)


class CreateDealerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=403)
        serializer = DealerProfileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Dealer created successfully'}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=403)
        dealers = DealerProfile.objects.filter(created_by=request.user).order_by('-created_at')
        serializer = DealerListSerializer(dealers, many=True)
        return Response(serializer.data)


class CreateSubDealerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'dealer':
            return Response({'error': 'Permission denied'}, status=403)
        serializer = SubDealerProfileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Sub Dealer created successfully'}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        if request.user.role != 'dealer':
            return Response({'error': 'Permission denied'}, status=403)
        sub_dealers = SubDealerProfile.objects.filter(created_by=request.user).order_by('-created_at')
        serializer = SubDealerListSerializer(sub_dealers, many=True)
        return Response(serializer.data)


class DealerListForDealerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['promotor', 'sub_dealer', 'dealer', 'admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=403)
        dealers = DealerProfile.objects.all()
        serializer = DealerListSerializer(dealers, many=True)
        return Response(serializer.data)


class AdminListForAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['promotor', 'sub_dealer', 'dealer', 'admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=403)
        admins = AdminProfile.objects.all()
        serializer = AdminListSerializer(admins, many=True)
        return Response(serializer.data)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {'role': user.role, 'email': user.email}

        if user.role == 'admin':
            try:
                p = AdminProfile.objects.get(user=user)
                data.update({
                    'initial': p.initial,
                    'first_name': p.first_name,
                    'last_name': p.last_name,
                    'mobile_number': p.mobile_number,
                    'gender': p.gender,
                    'dob': p.dob,
                    'married_status': p.married_status,
                    'anniversary_date': p.anniversary_date,
                    'admin_id': p.admin_id,
                    'admin_name': p.admin_name,
                    'admin_contact_no': p.admin_contact_no,
                    'door_no': p.door_no,
                    'street_name': p.street_name,
                    'town_name': p.town_name,
                    'city_name': p.city_name,
                    'district': p.district,
                    'state': p.state,
                    'aadhaar_no': p.aadhaar_no,
                    'pan_no': p.pan_no,
                    'occupation': p.occupation,
                    'occupation_detail': p.occupation_detail,
                    'annual_salary': p.annual_salary,
                    'created_at': p.user.created_at,
                })
            except Exception:
                pass

        elif user.role == 'dealer':
            try:
                p = user.dealer_profile
                data.update({
                    'first_name': p.first_name,
                    'last_name': p.last_name,
                    'mobile_number': p.mobile_number,
                    'gender': p.gender,
                    'dob': p.dob,
                    'married_status': p.married_status,
                    'anniversary_date': p.anniversary_date,
                    'dealer_id': p.dealer_id,
                    'dealer_name': p.dealer_name,
                    'dealer_contact_no': p.dealer_contact_no,
                    'door_no': p.door_no,
                    'street_name': p.street_name,
                    'town_name': p.town_name,
                    'city_name': p.city_name,
                    'district': p.district,
                    'state': p.state,
                    'aadhaar_no': p.aadhaar_no,
                    'pan_no': p.pan_no,
                    'occupation': p.occupation,
                    'occupation_detail': p.occupation_detail,
                    'annual_salary': p.annual_salary,
                    'created_at': p.created_at,
                    'admin_name': p.assigned_admin.admin_name if p.assigned_admin else None,
                    'admin_id': p.assigned_admin.admin_id if p.assigned_admin else None,
                    'admin_contact_no': p.assigned_admin.admin_contact_no if p.assigned_admin else None,
                })
            except DealerProfile.DoesNotExist:
                pass

        elif user.role == 'sub_dealer':
            try:
                p = user.sub_dealer_profile
                data.update({
                    'first_name': p.first_name,
                    'last_name': p.last_name,
                    'mobile_number': p.mobile_number,
                    'gender': p.gender,
                    'dob': p.dob,
                    'married_status': p.married_status,
                    'anniversary_date': p.anniversary_date,
                    'sub_dealer_id': p.sub_dealer_id,
                    'door_no': p.door_no,
                    'street_name': p.street_name,
                    'town_name': p.town_name,
                    'city_name': p.city_name,
                    'district': p.district,
                    'state': p.state,
                    'aadhaar_no': p.aadhaar_no,
                    'pan_no': p.pan_no,
                    'occupation': p.occupation,
                    'occupation_detail': p.occupation_detail,
                    'annual_salary': p.annual_salary,
                    'created_at': p.created_at,
                    'dealer_name': p.assigned_dealer.dealer_name if p.assigned_dealer else None,
                    'dealer_id': p.assigned_dealer.dealer_id if p.assigned_dealer else None,
                    'dealer_contact_no': p.assigned_dealer.dealer_contact_no if p.assigned_dealer else None,
                })
            except SubDealerProfile.DoesNotExist:
                pass

        elif user.role == 'promotor':
            try:
                p = user.promotor_profile
                data.update({
                    'initial': p.initial,
                    'first_name': p.first_name,
                    'last_name': p.last_name,
                    'mobile_number': p.mobile_number,
                    'gender': p.gender,
                    'dob': p.dob,
                    'married_status': p.married_status,
                    'anniversary_date': p.anniversary_date,
                    'promotor_id': p.promotor_id,
                    'promotor_name': p.promotor_name,
                    'promotor_contact_no': p.promotor_contact_no,
                    'door_no': p.door_no,
                    'street_name': p.street_name,
                    'town_name': p.town_name,
                    'city_name': p.city_name,
                    'district': p.district,
                    'state': p.state,
                    'aadhaar_no': p.aadhaar_no,
                    'pan_no': p.pan_no,
                    'occupation': p.occupation,
                    'occupation_detail': p.occupation_detail,
                    'annual_salary': p.annual_salary,
                    'created_at': p.created_at,
                    'sub_dealer_name': f"{p.assigned_sub_dealer.first_name} {p.assigned_sub_dealer.last_name}" if p.assigned_sub_dealer else None,
                    'sub_dealer_id': p.assigned_sub_dealer.sub_dealer_id if p.assigned_sub_dealer else None,
                    'sub_dealer_contact_no': p.assigned_sub_dealer.mobile_number if p.assigned_sub_dealer else None,
                })
            except PromotorProfile.DoesNotExist:
                pass

        elif user.role == 'customer':
            try:
                p = user.customer_profile
                data.update({
                    'initial': p.initial,
                    'first_name': p.first_name,
                    'last_name': p.last_name,
                    'mobile_number': p.mobile_number,
                    'gender': p.gender,
                    'dob': p.dob,
                    'married_status': p.married_status,
                    'anniversary_date': p.anniversary_date,
                    'customer_id': p.customer_id,
                    'door_no': p.door_no,
                    'street_name': p.street_name,
                    'town_name': p.town_name,
                    'city_name': p.city_name,
                    'district': p.district,
                    'state': p.state,
                    'aadhaar_no': p.aadhaar_no,
                    'pan_no': p.pan_no,
                    'occupation': p.occupation,
                    'occupation_detail': p.occupation_detail,
                    'annual_salary': p.annual_salary,
                    'created_at': p.created_at,
                    'promotor_name': f"{p.assigned_promotor.first_name} {p.assigned_promotor.last_name}" if p.assigned_promotor else None,
                    'promotor_id': p.assigned_promotor.promotor_id if p.assigned_promotor else None,
                    'promotor_contact_no': p.assigned_promotor.promotor_contact_no if p.assigned_promotor else None,
                })
            except CustomerProfile.DoesNotExist:
                pass

        return Response(data)


class CreatePromotorView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'sub_dealer':
            return Response({'error': 'Permission denied'}, status=403)
        serializer = PromotorProfileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Promotor created successfully'}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        if request.user.role != 'sub_dealer':
            return Response({'error': 'Permission denied'}, status=403)
        promotors = PromotorProfile.objects.filter(created_by=request.user).order_by('-created_at')
        serializer = PromotorListSerializer(promotors, many=True)
        return Response(serializer.data)


class CreateCustomerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'promotor':
            return Response({'error': 'Permission denied'}, status=403)
        serializer = CustomerProfileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Customer created successfully'}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        if request.user.role not in ['promotor', 'sub_dealer', 'dealer', 'admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=403)
        customers = CustomerProfile.objects.all().order_by('-created_at')
        serializer = CustomerListSerializer(customers, many=True)
        return Response(serializer.data)


class PromotorListForView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['promotor', 'sub_dealer', 'dealer', 'admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=403)
        promotors = PromotorProfile.objects.all()
        serializer = PromotorListSerializer(promotors, many=True)
        return Response(serializer.data)


class SubDealerListForView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['promotor', 'sub_dealer', 'dealer', 'admin', 'super_admin']:
            return Response({'error': 'Permission denied'}, status=403)
        sub_dealers = SubDealerProfile.objects.all()
        serializer = SubDealerListSerializer(sub_dealers, many=True)
        return Response(serializer.data)


class FullHierarchyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['super_admin', 'admin', 'dealer', 'sub_dealer']:
            return Response({'error': 'Permission denied'}, status=403)

        if request.user.role == 'admin':
            try:
                current_admin = AdminProfile.objects.get(user=request.user)
                admins = [current_admin]
            except AdminProfile.DoesNotExist:
                admins = []
        else:
            admins = AdminProfile.objects.all()

        tree = []

        for admin in admins:
            dealers = DealerProfile.objects.filter(
                assigned_admin=admin
            ) | DealerProfile.objects.filter(
                assigned_admin__isnull=True,
                created_by=admin.user
            )
            dealers = dealers.distinct()
            dealer_list = []

            for dealer in dealers:
                sub_dealers = SubDealerProfile.objects.filter(
                    assigned_dealer=dealer
                ) | SubDealerProfile.objects.filter(
                    assigned_dealer__isnull=True,
                    created_by=dealer.user
                )
                sub_dealers = sub_dealers.distinct()
                sub_dealer_list = []

                for sd in sub_dealers:
                    promotors = PromotorProfile.objects.filter(
                        assigned_sub_dealer=sd
                    ) | PromotorProfile.objects.filter(
                        assigned_sub_dealer__isnull=True,
                        created_by=sd.user
                    )
                    promotors = promotors.distinct()
                    promotor_list = []

                    for pr in promotors:
                        customers = CustomerProfile.objects.filter(
                            assigned_promotor=pr
                        ) | CustomerProfile.objects.filter(
                            assigned_promotor__isnull=True,
                            created_by=pr.user
                        )
                        customers = customers.distinct()
                        customer_list = [
                            {
                                'id': c.id,
                                'customer_id': c.customer_id,
                                'first_name': c.first_name,
                                'last_name': c.last_name,
                                'mobile_number': c.mobile_number,
                                'city_name': c.city_name,
                            }
                            for c in customers
                        ]
                        promotor_list.append({
                            'id': pr.id,
                            'promotor_id': pr.promotor_id,
                            'first_name': pr.first_name,
                            'last_name': pr.last_name,
                            'mobile_number': pr.mobile_number,
                            'city_name': pr.city_name,
                            'customers': customer_list,
                        })

                    sub_dealer_list.append({
                        'id': sd.id,
                        'sub_dealer_id': sd.sub_dealer_id,
                        'first_name': sd.first_name,
                        'last_name': sd.last_name,
                        'mobile_number': sd.mobile_number,
                        'city_name': sd.city_name,
                        'promotors': promotor_list,
                    })

                dealer_list.append({
                    'id': dealer.id,
                    'dealer_id': dealer.dealer_id,
                    'first_name': dealer.first_name,
                    'last_name': dealer.last_name,
                    'mobile_number': dealer.mobile_number,
                    'city_name': dealer.city_name,
                    'sub_dealers': sub_dealer_list,
                })

            tree.append({
                'id': admin.id,
                'admin_id': admin.admin_id,
                'first_name': admin.first_name,
                'last_name': admin.last_name,
                'mobile_number': admin.mobile_number,
                'city_name': admin.city_name,
                'dealers': dealer_list,
            })

        return Response({'super_admin_email': request.user.email, 'admins': tree})

class AnnouncementView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        serializer = AnnouncementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response({'message': 'Announcement sent successfully'}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        role = request.user.role
        if role == 'super_admin':
            announcements = Announcement.objects.filter(is_active=True).order_by('-created_at')
        else:
            announcements = Announcement.objects.filter(
                is_active=True,
                target_roles__contains=role
            ).order_by('-created_at')
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data)


class AnnouncementReplyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Only super_admin OR the mentioned person can read replies."""
        try:
            announcement = Announcement.objects.get(id=pk)
        except Announcement.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        user = request.user
        if user.role != 'super_admin' and not is_user_mentioned_in_title(announcement.title, user):
            return Response({'error': 'Permission denied'}, status=403)

        replies = AnnouncementReply.objects.filter(
            announcement=announcement
        ).order_by('-created_at')
        serializer = AnnouncementReplySerializer(replies, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        """Anyone can reply, but only once per announcement."""
        try:
            announcement = Announcement.objects.get(id=pk)
        except Announcement.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        if AnnouncementReply.objects.filter(
            announcement=announcement, replied_by=request.user
        ).exists():
            return Response({'error': 'Already replied'}, status=400)

        message = request.data.get('message', '').strip()
        if not message:
            return Response({'error': 'Message required'}, status=400)

        reply = AnnouncementReply.objects.create(
            announcement=announcement,
            replied_by=request.user,
            message=message
        )
        return Response(AnnouncementReplySerializer(reply).data, status=201)        

class ProfileUpdateRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)

        qs = ProfileUpdateRequest.objects.filter(status='pending').order_by('-created_at')
        serializer = ProfileUpdateRequestSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProfileUpdateRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'message': 'Profile update request submitted'}, status=201)
        return Response(serializer.errors, status=400)


class ProfileUpdateApproveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)

        req = ProfileUpdateRequest.objects.get(id=pk)

        profile_map = {
            'admin': 'admin_profile',
            'dealer': 'dealer_profile',
            'sub_dealer': 'sub_dealer_profile',
            'promotor': 'promotor_profile',
            'customer': 'customer_profile',
        }

        profile = getattr(req.user, profile_map[req.user.role])

        fields = [
            'initial', 'first_name', 'last_name', 'mobile_number',
            'gender', 'dob', 'married_status', 'anniversary_date',
            'door_no', 'street_name', 'town_name', 'city_name',
            'district', 'state', 'aadhaar_no', 'pan_no',
            'occupation', 'occupation_detail', 'annual_salary'
        ]

        for field in fields:
            value = getattr(req, field)
            if value not in ['', None]:
                setattr(profile, field, value)

        profile.save()
        req.status = 'approved'
        req.save()

        return Response({'message': 'Request approved and profile updated'})


class MetalRateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return today's rate; if not entered yet, return latest available."""
        from django.utils import timezone
        today = timezone.now().date()

        rate = MetalRate.objects.filter(date=today).first()
        if not rate:
            rate = MetalRate.objects.order_by('-date').first()

        if not rate:
            return Response({'error': 'No rates entered yet'}, status=404)

        serializer = MetalRateSerializer(rate)
        return Response(serializer.data)

    def post(self, request):
        """Super admin sets/updates rate for a given date."""
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)

        date = request.data.get('date')
        if not date:
            return Response({'error': 'date is required'}, status=400)

        existing = MetalRate.objects.filter(date=date).first()
        if existing:
            serializer = MetalRateSerializer(existing, data=request.data, partial=True)
        else:
            serializer = MetalRateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

class MetalOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Customer places an order."""
        data = request.data
        metal_type = data.get('metal_type')
        weight_label = data.get('weight_label')
        weight_grams = float(data.get('weight_grams', 0))
        count = int(data.get('count', 1))
        rate_per_gram = float(data.get('rate_per_gram', 0))

        if not all([metal_type, weight_label, weight_grams, count, rate_per_gram]):
            return Response({'error': 'All fields required'}, status=400)

        unit_price = round(weight_grams * rate_per_gram, 2)
        total_amount = round(unit_price * count, 2)

        order = MetalOrder.objects.create(
            user=request.user,
            metal_type=metal_type,
            weight_label=weight_label,
            weight_grams=weight_grams,
            count=count,
            rate_per_gram=rate_per_gram,
            unit_price=unit_price,
            total_amount=total_amount,
        )
        return Response({
            'message': 'Order placed successfully!',
            'order_id': order.id,
            'total_amount': total_amount,
        }, status=201)

    def get(self, request):
        """Super admin sees all orders; customer sees own orders."""
        if request.user.role == 'super_admin':
            orders = MetalOrder.objects.all().order_by('-created_at')
        else:
            orders = MetalOrder.objects.filter(user=request.user).order_by('-created_at')
        serializer = MetalOrderSerializer(orders, many=True)
        return Response(serializer.data)
class MetalOrderSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)

        def summarize(qs):
            from django.db.models import Sum, Count
            result = {}
            for metal in ['gold_22k', 'gold_24k', 'silver_999']:
                metal_qs = qs.filter(metal_type=metal)
                agg = metal_qs.aggregate(
                    total_orders=Count('id'),
                    total_grams=Sum('weight_grams'),
                    total_amount=Sum('total_amount'),
                )
                result[metal] = {
                    'orders': agg['total_orders'] or 0,
                    'grams': float(agg['total_grams'] or 0),
                    'amount': float(agg['total_amount'] or 0),
                }
            return result

        base = MetalOrder.objects.filter(user=user)

        return Response({
            'today': summarize(base.filter(created_at__date=today)),
            'week':  summarize(base.filter(created_at__date__gte=week_start)),
            'month': summarize(base.filter(created_at__date__gte=month_start)),
        })    


# ADD AT BOTTOM OF views.py (before the ping function):

class JewelryProductView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]       # GET = anyone can view
        return [IsAuthenticated()] 

    def post(self, request):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        
        # Handle multipart form data
        data = request.data.dict() if hasattr(request.data, 'dict') else dict(request.data)
        images = request.FILES.getlist('uploaded_images')
        
        serializer = JewelryProductSerializer(
            data={**data, 'uploaded_images': images},
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Product created!', 'data': serializer.data}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request):
        category = request.query_params.get('category')
        metal = request.query_params.get('metal')
        
        qs = JewelryProduct.objects.filter(is_active=True).prefetch_related('images')
        if category:
           qs = qs.filter(category=category)
        if metal:
           qs = qs.filter(metal=metal)

        gender = request.query_params.get('gender')
        occasion = request.query_params.get('occasion')
        if gender and gender != 'all':
           qs = qs.filter(gender=gender)
        if occasion:
           qs = qs.filter(occasion=occasion)
        wedding_category = request.query_params.get('wedding_category')
        if wedding_category:
           qs = qs.filter(wedding_category=wedding_category)   
        grade = request.query_params.get('grade')
        if grade:
           qs = qs.filter(grade=grade)
        serializer = JewelryProductSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)


class JewelryProductDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def patch(self, request, pk):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        try:
            product = JewelryProduct.objects.get(id=pk)
        except JewelryProduct.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        for field in ['category', 'metal', 'grade', 'name', 'description',
                      'cross_weight', 'stone_weight', 'net_weight',
                      'making_charge', 'stone_value', 'price', 'tag', 'is_active']:
            if field in request.data:
                setattr(product, field, request.data[field])
        product.save()

        new_images = request.FILES.getlist('uploaded_images')
        if new_images:
            last_order = product.images.count()
            for i, img in enumerate(new_images):
                JewelryProductImage.objects.create(product=product, image=img, order=last_order + i)

        serializer = JewelryProductSerializer(product, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):
        if request.user.role != 'super_admin':  # ✅ 8 spaces
            return Response({'error': 'Permission denied'}, status=403)
        try:
            product = JewelryProduct.objects.get(id=pk)
            product.delete()
            return Response({'message': 'Product deleted'})
        except JewelryProduct.DoesNotExist:
            return Response({'error': 'Not found'}, status=404) 


class JewelryProductImageDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        try:
            img = JewelryProductImage.objects.get(id=pk)
            img.image.delete()
            img.delete()
            return Response({'message': 'Image deleted'})
        except JewelryProductImage.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)



class HomeBannerView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        banners = HomeBanner.objects.filter(is_active=True).order_by('slot')
        serializer = HomeBannerSerializer(banners, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        slot = request.data.get('slot')
        image = request.FILES.get('image')
        if not slot or not image:
            return Response({'error': 'slot and image required'}, status=400)
        existing = HomeBanner.objects.filter(slot=slot).first()
        if existing:
            existing.image.delete(save=False)
            existing.image = image
            existing.is_active = True
            existing.save()
            serializer = HomeBannerSerializer(existing, context={'request': request})
            return Response(serializer.data)
        banner = HomeBanner.objects.create(slot=slot, image=image)
        serializer = HomeBannerSerializer(banner, context={'request': request})
        return Response(serializer.data, status=201)


class HomeBannerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        try:
            banner = HomeBanner.objects.get(id=pk)
        except HomeBanner.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        if 'image' in request.FILES:
            banner.image.delete(save=False)
            banner.image = request.FILES['image']
        if 'is_active' in request.data:
            banner.is_active = request.data['is_active'] in [True, 'true', '1']
        banner.save()
        serializer = HomeBannerSerializer(banner, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):
        if request.user.role != 'super_admin':
            return Response({'error': 'Permission denied'}, status=403)
        try:
            banner = HomeBanner.objects.get(id=pk)
            banner.image.delete(save=False)
            banner.delete()
            return Response({'message': 'Banner deleted'})
        except HomeBanner.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)   


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """User's cart items fetch"""
        items = CartItem.objects.filter(user=request.user).select_related('product').prefetch_related('product__images')
        serializer = CartItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Add to cart - product_id + qty"""
        product_id = request.data.get('product_id')
        qty = int(request.data.get('qty', 1))

        if not product_id:
            return Response({'error': 'product_id required'}, status=400)

        try:
            product = JewelryProduct.objects.get(id=product_id, is_active=True)
        except JewelryProduct.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

        # Already in cart → qty update
        item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'qty': qty}
        )
        if not created:
            item.qty += qty
            item.save()

        serializer = CartItemSerializer(item, context={'request': request})
        return Response(serializer.data, status=201 if created else 200)

    def delete(self, request):
        """Remove specific item - product_id send பண்ணு"""
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id required'}, status=400)

        CartItem.objects.filter(user=request.user, product_id=product_id).delete()
        return Response({'message': 'Removed from cart'})


class CartItemQtyView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        """Update qty for a cart item"""
        try:
            item = CartItem.objects.get(id=pk, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        qty = int(request.data.get('qty', 1))
        if qty < 1:
            item.delete()
            return Response({'message': 'Item removed'})

        item.qty = qty
        item.save()
        serializer = CartItemSerializer(item, context={'request': request})
        return Response(serializer.data)                     

class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Wishlist.objects.filter(user=request.user).select_related('product').prefetch_related('product__images')
        serializer = WishlistItemSerializer(items, many=True, context={'request': request})
        return Response({'count': items.count(), 'items': serializer.data})

    def post(self, request):
        """Toggle wishlist — add if not exists, remove if exists"""
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id required'}, status=400)
        try:
            product = JewelryProduct.objects.get(id=product_id, is_active=True)
        except JewelryProduct.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

        existing = Wishlist.objects.filter(user=request.user, product=product).first()
        if existing:
            existing.delete()
            return Response({'action': 'removed', 'message': 'Removed from wishlist'})
        else:
            Wishlist.objects.create(user=request.user, product=product)
            return Response({'action': 'added', 'message': 'Added to wishlist'}, status=201)

    def delete(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id required'}, status=400)
        Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
        return Response({'message': 'Removed from wishlist'})

        
@api_view(['GET'])
@permission_classes([AllowAny])
def ping(request):
    return Response({'status': 'ok'})
