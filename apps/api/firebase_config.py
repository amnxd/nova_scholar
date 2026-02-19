import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
def initialize_firebase():
    if not firebase_admin._apps:
        # Check for service account file
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "nova-scholar-f10d5-firebase-adminsdk-fbsvc-9ac6252f8f.json")
        
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print(f"Firebase Admin initialized with service account: {service_account_path}")
        else:
            # Fallback to default credentials (useful for GCP environments)
            # or try to use environment variables for credentials if set
            print("Service account not found. Using default credentials or checking other env vars.")
            try:
                firebase_admin.initialize_app()
            except Exception as e:
                print(f"Failed to initialize Firebase Admin with default credentials: {e}")
                # For local dev without creds, some features might not work, 
                # but we'll allow it to pass so the app doesn't crash immediately 
                # if the user hasn't set up auth yet.
                pass
    
    return firestore.client()

db = initialize_firebase()
