import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin
# Replace 'path/to/serviceAccountKey.json' with actual path or use environment variables
# For now, we will use a placeholder or default app if already initialized.

def initialize_firebase():
    if not firebase_admin._apps:
        # cred = credentials.Certificate("path/to/service-account-file.json")
        # firebase_admin.initialize_app(cred)
        # For development without service account (restricted):
        firebase_admin.initialize_app()
    
    return firestore.client()

db = initialize_firebase()
