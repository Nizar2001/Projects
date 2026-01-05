#!/bin/sh
echo "run script"
python manage.py migrate
# gunicorn --workers 3 --bind 0.0.0.0:8000 djangobackend.wsgi:application
python manage.py runserver 0.0.0.0:8000
