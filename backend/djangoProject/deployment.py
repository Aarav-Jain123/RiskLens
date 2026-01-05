import os
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME'], 'localhost']
CSRF_TRUSTED_ORIGINS = [f'https://{os.environ["WEBSITE_HOSTNAME"]}']

DEBUG = False

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'mainapp.middleware.StaffRequiredMiddleware', 
]

# CORS_ALLOWED_ORIGINS = [
# ]

STORAGES = {
    {
        # 'default': {
        #     'BACKEND': 'django.core.files.storage.FileSystemStorage',     
        # },
        'staticfiles': {
            # 'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
            'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
        },
    }
}

# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage' if using django older than 4.2


CONNECTION = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING']
CONNECTION_STR = {pair.split('=')[0]:pair.split('=')[1] for pair in CONNECTION.split(' ')} # add ; if needed

DATABASES = {       
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": CONNECTION_STR["dbname"],
        "HOST": CONNECTION_STR["host"],
        "USER": CONNECTION_STR["user"],
        "PASSWORD": CONNECTION_STR["password"],
    }
}

STATIC_ROOT = BASE_DIR / 'staticfiles'

SECRET_KEY = os.environ['MY_SECRET_KEY']