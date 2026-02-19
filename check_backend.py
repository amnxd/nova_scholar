import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def check_backend():
    print(f"Checking backend at {BASE_URL}...")
    try:
        with urllib.request.urlopen(f"{BASE_URL}/", timeout=5) as response:
            if response.status == 200:
                print("âœ… Backend is RUNNING and reachable.")
                data = json.loads(response.read().decode())
                print(f"Response: {data}")
                return True
            else:
                print(f"â Œ Backend reachable but returned status {response.status}")
                return False
    except urllib.error.URLError as e:
        print(f"â Œ Backend is NOT reachable. Error: {e}")
        print("Make sure the backend is running on port 8000.")
        return False
    except Exception as e:
        print(f"â Œ An error occurred: {e}")
        return False

if __name__ == "__main__":
    success = check_backend()
    sys.exit(0 if success else 1)
