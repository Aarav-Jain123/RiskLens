from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from .forms import *
from .model import main
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
import os


# Create your views here.

def home(request):
    return HttpResponse('<a href="model_page/">home.html</a>')


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def model_page(request):
    form = NewThreatReportForm(request.POST, request.FILES)
    file = request.FILES['csv_file']
    if form.is_valid():
        instance = form.save()
        threat_data = main(instance.csv_file.path)
        print(threat_data)
        return Response(threat_data, status=200)
    else:
        return Response({"status": "error", "errors": form.errors}, status=400)


@api_view(['GET'])
def clean_dataset_page(request):
    csv_path = os.path.join(settings.BASE_DIR, 'clean_dataset.csv')
    threat_data = main(csv_path)
    return Response(threat_data, status=200)
 

@api_view(['GET'])
def dirty_dataset_page(request):
    csv_path = os.path.join(settings.BASE_DIR, 'dirty_dataset.csv')
    threat_data = main(csv_path)
    return Response(threat_data, status=200)
