import os
from r2r import R2RClient
from openai import OpenAI
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

r2r = R2RClient(settings.R2R_URL)
openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
