from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework import serializers
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Doctor, Patient, User


def user_payload(user):
    if user.role == User.Role.DOCTOR:
        profile = getattr(user, "doctor_profile", None)
    else:
        profile = getattr(user, "patient_profile", None)
    return {
        "id": user.id,
        "name": user.first_name or user.username,
        "email": user.email,
        "role": user.role,
        "profile_id": profile.id if profile else None,
    }


def tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": user_payload(user),
    }


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.PATIENT)
    age = serializers.IntegerField(min_value=0, max_value=120, default=30)
    gender = serializers.CharField(max_length=20, default="Not specified")

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    with transaction.atomic():
        user = User.objects.create_user(
            username=data["email"],
            email=data["email"],
            password=data["password"],
            first_name=data["name"],
            role=data["role"],
        )
        if data["role"] == User.Role.DOCTOR:
            doctor_name = data["name"] if data["name"].startswith("Dr") else f"Dr. {data['name']}"
            Doctor.objects.create(user=user, name=doctor_name)
        else:
            Patient.objects.create(
                user=user, name=data["name"], age=data["age"], gender=data["gender"]
            )
    return Response(tokens_for(user), status=201)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    email = str(request.data.get("email", "")).strip().lower()
    password = request.data.get("password", "")
    user = authenticate(username=email, password=password)
    if user is None:
        return Response({"detail": "Wrong email or password."}, status=401)
    return Response(tokens_for(user))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(user_payload(request.user))