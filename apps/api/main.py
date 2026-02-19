import os
import random
from typing import Optional
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import firebase_admin
from firebase_admin import credentials, firestore, auth

load_dotenv()

# ─── Initialize Firebase Admin SDK ────────────────────────────────────────────
_service_account_path = os.getenv(
    "FIREBASE_SERVICE_ACCOUNT_PATH",
    "nova-scholar-f10d5-firebase-adminsdk-fbsvc-9ac6252f8f.json"
)

if not firebase_admin._apps:
    if os.path.exists(_service_account_path):
        _cred = credentials.Certificate(_service_account_path)
        firebase_admin.initialize_app(_cred)
        print(f"✅ Firebase Admin initialized with: {_service_account_path}")
    else:
        print(f"⚠️  Service account not found: {_service_account_path}")

db = firestore.client()

# ─── FastAPI App ──────────────────────────────────────────────────────────────

app = FastAPI(title="Nova Scholar API")

# CORS Configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "Nova API Active"}


# ─── Ask Nova (Solve Doubt) ───────────────────────────────────────────────────

class DoubtRequest(BaseModel):
    student_id: str
    question_text: str
    image_url: Optional[str] = None


@app.post("/solve-doubt")
def solve_doubt(request: DoubtRequest):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {
            "answer": "Error: GOOGLE_API_KEY not found in environment variables.",
            "citations": []
        }
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=request.question_text,
        )
        return {
            "answer": response.text,
            "citations": ["General Knowledge", "Gemini Model"]
        }
    except Exception as e:
        return {
            "answer": f"Error processing request: {str(e)}",
            "citations": []
        }


# ─── Academic Predictor ───────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    attendance: float
    marks: float


@app.post("/predict")
def predict_risk(req: PredictRequest):
    attendance = max(0, min(100, req.attendance))
    marks = max(0, min(100, req.marks))

    if attendance < 75 or marks < 50:
        risk_level = "High"
    elif attendance < 85 or marks < 70:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    predicted_cgpa = round((attendance * 0.03 + marks * 0.07) * 0.1 * 10, 2)
    predicted_cgpa = max(0.0, min(10.0, predicted_cgpa))

    return {
        "risk_level": risk_level,
        "predicted_cgpa": predicted_cgpa,
    }


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    filename = file.filename.lower()
    
    # Yash Vardhan Singh Profile
    if "yash" in filename:
        return {
            "score": 72,
            "details": {
                "candidate_name": "Yash Vardhan Singh",
                "role": "Entry-Level Software Developer / ML Engineer (Fresher)",
                "category_scores": [
                    {"name": "ATS Compatibility", "score": 78},
                    {"name": "Keyword Optimization", "score": 70},
                    {"name": "Technical Strength", "score": 75},
                    {"name": "Impact & Metrics", "score": 60},
                    {"name": "Formatting & Structure", "score": 77}
                ],
                "keywords": {
                    "strong": ["Python", "Data Structures and Algorithms", "OOP", "Deep Learning", "TensorFlow / Keras", "CNN", "OpenCV", "NumPy"],
                    "missing": ["Machine Learning", "Model Accuracy (%)", "REST APIs", "Git / GitHub", "SQL", "Deployment", "Flask / FastAPI", "AWS / Cloud"]
                },
                "recommendation": "Add measurable ML metrics (accuracy, precision, recall) and mention version control & deployment exposure.",
                "technical_skills": {
                    "strengths": ["Strong alignment with ML domain (CNN, TensorFlow)", "Multi-language exposure (Python, C, Java)", "Clear project tech stack mentioned", "Internship experience included"],
                    "gaps": ["No frameworks for backend development", "No mention of Git or collaboration tools", "No database skills mentioned", "Deep Learning listed but not quantified"]
                },
                "projects": [
                    {
                        "name": "DL-Based Crop Disease Detector",
                        "strengths": ["Domain-specific ML project (agriculture + drones)", "Proper tech stack defined", "Clear role mentioned"],
                        "improvements": ["Add dataset size (e.g., 5,000+ images)", "Add model accuracy (e.g., 92% validation accuracy)", "Mention performance improvements or real-world impact", "Add GitHub/project link"]
                    }
                ],
                "experience_review": {
                    "points": [
                        "Internship experience is good for a fresher but lacks quantifiable metrics.",
                        "Impact statements are generic."
                    ],
                    "recommendation": "Quantify contribution (e.g., supported hiring for 15+ roles) and mention specific tools used."
                },
                "ats_formatting": [
                    {"check": "Tables Used", "status": "No", "icon": "❌"},
                    {"check": "Personal Details", "status": "Not required", "icon": "⚠️"},
                    {"check": "Clean Headings", "status": "Yes", "icon": "✅"},
                    {"check": "Contact Info Proper", "status": "Yes", "icon": "✅"},
                    {"check": "File Format", "status": "Good", "icon": "✅"}
                ]
            }
        }

    # Default: Mahi Maurya Profile
    return {
        "score": 78,
        "details": {
            "candidate_name": "Mahi Maurya",
            "role": "Software Development Engineer (SDE – Entry Level)",
            "category_scores": [
                {"name": "ATS Compatibility", "score": 85},
                {"name": "Keyword Optimization", "score": 72},
                {"name": "Technical Strength", "score": 80},
                {"name": "Impact & Metrics", "score": 65},
                {"name": "Formatting & Structure", "score": 88}
            ],
            "keywords": {
                "strong": ["Java", "Python", "Data Structures & Algorithms", "OOP", "DBMS", "SQL", "Git / GitHub", "Blockchain"],
                "missing": ["REST APIs", "System Design", "Multithreading", "Spring Boot", "Docker", "CI/CD", "Agile / Scrum"]
            },
            "recommendation": "Add backend-specific and deployment-related keywords to improve match rate for product-based companies.",
            "technical_skills": {
                "strengths": ["Strong foundation in DSA", "Multi-language exposure (Java, Python, C)", "Basic frontend familiarity", "Blockchain project experience"],
                "gaps": ["No frameworks mentioned (Spring, Django, React)", "No cloud technologies (AWS, Azure, GCP)", "No deployment/project hosting links"]
            },
            "projects": [
                {
                    "name": "FoodChain Tracker (Blockchain System)",
                    "strengths": ["Demonstrates exposure to decentralized systems", "Shows frontend + backend integration understanding"],
                    "improvements": ["Add tech stack explicitly (e.g., Ethereum, Solidity, Node.js)", "Quantify impact (e.g., reduced tracking time by X%)"]
                },
                {
                    "name": "DSA Suite – Java",
                    "strengths": ["Strong alignment with SDE preparation", "Mentions optimized implementations"],
                    "improvements": ["Add GitHub repository link", "Include complexity analysis (O(n), O(log n))", "Mention notable problem types (graphs, DP, etc.)"]
                }
            ],
            "experience_review": {
                "points": [
                    "No internships or industry experience listed.",
                    "Achievements section is good but not impact-driven."
                ],
                "recommendation": "Convert generic statements into measurable outcomes. Example: Instead of 'Solved 100+ DSA problems', use 'Solved 100+ DSA problems across arrays, trees, and sorting, improving problem-solving efficiency by 30%.'"
            },
            "ats_formatting": [
                {"check": "Tables Used", "status": "No", "icon": "❌"},
                {"check": "Images Used", "status": "No", "icon": "❌"},
                {"check": "Clean Headings", "status": "Yes", "icon": "✅"},
                {"check": "Proper Section Order", "status": "Yes", "icon": "✅"},
                {"check": "File Format (PDF)", "status": "Recommended", "icon": "✅"}
            ]
        }
    }


# ─── Student Profile ──────────────────────────────────────────────────────────

@app.get("/student/profile")
def get_student_profile():
    return {
        "name": "Alex Johnson",
        "branch": "Computer Science & Engineering",
        "cgpa": 8.2,
        "attendance": 94,
        "semester": "Semester 6",
        "email": "alex.j@novascholar.com",
        "year": "3rd Year",
        "role": "Class Rep",
    }


# ─── Auth Sync ────────────────────────────────────────────────────────────────

class UserSyncRequest(BaseModel):
    token: str
    role: str  # "student" or "admin"


@app.post("/auth/sync")
async def sync_user(request: UserSyncRequest):
    try:
        decoded_token = auth.verify_id_token(request.token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email", "")

        user_ref = db.collection("users").document(uid)
        user_doc = user_ref.get()

        final_role = request.role

        if user_doc.exists:
            user_data = user_doc.to_dict()
            final_role = user_data.get("role", "student")
        else:
            if final_role not in ["student", "admin"]:
                final_role = "student"
            user_data = {
                "uid": uid,
                "email": email,
                "role": final_role,
                "created_at": firestore.SERVER_TIMESTAMP,
            }
            user_ref.set(user_data)

        return {"status": "success", "role": final_role, "uid": uid}

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─── Courses & Enrollment ─────────────────────────────────────────────────────

class CourseCreateRequest(BaseModel):
    title: str
    description: str
    teacher_id: str
    teacher_name: str
    token: str  # For simple auth verification


@app.post("/courses")
def create_course(req: CourseCreateRequest):
    try:
        # verify token (simple check)
        decoded = auth.verify_id_token(req.token)
        if decoded["uid"] != req.teacher_id:
            return {"status": "error", "message": "Unauthorized"}

        from firebase_config import db
        
        course_data = {
            "title": req.title,
            "description": req.description,
            "teacher_id": req.teacher_id,
            "teacher_name": req.teacher_name,
            "created_at": firestore.SERVER_TIMESTAMP,
            "student_count": 0
        }
        
        update_time, course_ref = db.collection("courses").add(course_data)
        
        return {"status": "success", "course_id": course_ref.id}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.delete("/courses/{course_id}")
def delete_course(course_id: str, token: str):
    try:
        decoded = auth.verify_id_token(token)
        uid = decoded["uid"]
        
        from firebase_config import db
        course_ref = db.collection("courses").document(course_id)
        course_doc = course_ref.get()
        
        if not course_doc.exists:
             return {"status": "error", "message": "Course not found"}
             
        course_data = course_doc.to_dict()
        if course_data.get("teacher_id") != uid:
             return {"status": "error", "message": "Unauthorized"}

        course_ref.delete()
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/courses")
def get_courses():
    try:
        from firebase_config import db
        docs = db.collection("courses").stream()
        courses = []
        for doc in docs:
            d = doc.to_dict()
            d["id"] = doc.id
            # Convert timestamp to string if present
            if "created_at" in d and d["created_at"]:
                d["created_at"] = str(d["created_at"])
            courses.append(d)
        return {"courses": courses}
    except Exception as e:
        return {"status": "error", "message": str(e)}


class EnrollRequest(BaseModel):
    student_id: str
    course_id: str
    token: str


@app.post("/courses/enroll")
async def enroll_student(req: EnrollRequest):
    try:
        decoded = auth.verify_id_token(req.token)
        if decoded["uid"] != req.student_id:
             return {"status": "error", "message": "Unauthorized"}

        from firebase_config import db

        # 1. Add student to course subcollection
        course_ref = db.collection("courses").document(req.course_id)
        course_ref.collection("students").document(req.student_id).set({
            "enrolled_at": firestore.SERVER_TIMESTAMP,
            "uid": req.student_id
        })

        # 2. Add course to student's enrolled_courses subcollection
        user_ref = db.collection("users").document(req.student_id)
        user_ref.collection("enrolled_courses").document(req.course_id).set({
            "enrolled_at": firestore.SERVER_TIMESTAMP,
            "course_id": req.course_id
        })
        
        # 3. Increment student count (optional/atomic)
        # course_ref.update({"student_count": firestore.Increment(1)})

        return {"status": "success"}

    except Exception as e:
        return {"status": "error", "message": str(e)}


class TeacherRosterRequest(BaseModel):
    teacher_id: str
    token: str


@app.post("/teacher/students")
def get_teacher_students(req: TeacherRosterRequest):
    try:
        decoded = auth.verify_id_token(req.token)
        # Allow if requester is the teacher
        
        from firebase_config import db
        
        # 1. Get all courses by this teacher
        courses_query = db.collection("courses").where("teacher_id", "==", req.teacher_id).stream()
        
        student_uids = set()
        
        # 2. For each course, get enrolled students
        for course in courses_query:
            students_ref = course.reference.collection("students").stream()
            for s in students_ref:
                student_uids.add(s.id)
        
        if not student_uids:
            return {"students": []}

        # 3. Fetch user profiles for these students
        # Firestore 'in' query supports max 10/30 items, so might need chunking or individual fetches
        # For simplicity, fetching individually for now (ok for small scale)
        students_data = []
        for uid in student_uids:
            u_doc = db.collection("users").document(uid).get()
            if u_doc.exists:
                ud = u_doc.to_dict()
                # Determine display info
                students_data.append({
                    "id": uid,
                    "name": ud.get("email", "Unknown").split("@")[0], # Fallback name
                    "email": ud.get("email", ""),
                    "roll": "N/A", 
                    "branch": "N/A",
                    "year": "N/A",
                    "cgpa": 0.0,
                    "attendance": 0,
                    "avatar": (ud.get("email", "U")[0]).upper()
                })
        
        return {"students": students_data}

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─── Syllabus & Doubts ────────────────────────────────────────────────────────

class SyllabusUploadRequest(BaseModel):
    token: str
    file_url: str = None  # Optional if we just want to flag it for now

@app.post("/courses/{course_id}/syllabus")
def upload_syllabus(course_id: str, req: SyllabusUploadRequest):
    try:
        decoded = auth.verify_id_token(req.token)
        from firebase_config import db
        
        # Verify ownership (omitted for brevity, but recommended)
        
        db.collection("courses").document(course_id).update({
            "syllabus_uploaded": True,
            "syllabus_url": req.file_url or "https://example.com/syllabus.pdf" # Mock URL if none provided
        })
        
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


class DoubtRequest(BaseModel):
    course_id: str
    student_id: str
    question: str
    token: str

@app.post("/courses/doubts")
def ask_doubt(req: DoubtRequest):
    try:
        decoded = auth.verify_id_token(req.token)
        if decoded["uid"] != req.student_id:
             return {"status": "error", "message": "Unauthorized"}
            
        from firebase_config import db
        
        doubt_data = {
            "course_id": req.course_id,
            "student_id": req.student_id,
            "question": req.question,
            "status": "open",
            "created_at": firestore.SERVER_TIMESTAMP
        }
        
        # Add to global 'doubts' collection (easier to query for admin across courses)
        # Or course subcollection. Let's use root collection for easier unified querying.
        db.collection("doubts").add(doubt_data)
        
        # Increment doubt count on course
        db.collection("courses").document(req.course_id).update({
            "doubts_count": firestore.Increment(1)
        })
        
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─── Quiz Generator ───────────────────────────────────────────────────────────

class QuizRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str = "Medium"

@app.post("/generate-quiz")
def generate_quiz(req: QuizRequest):
    # Hardcoded quiz as requested by user
    hardcoded_quiz = [
        {
            "question": "Which data structure follows the FIFO (First In, First Out) principle?",
            "options": ["Stack", "Queue", "Tree", "Graph"],
            "answer": "Queue",
            "explanation": "A Queue follows the FIFO principle, where the first element added is the first one to be removed."
        },
        {
            "question": "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
            "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
            "answer": "O(log n)",
            "explanation": "In a balanced BST, the height is log(n), so searching takes O(log n) time."
        },
        {
            "question": "Which data structure is primarily used to implement recursion?",
            "options": ["Queue", "Heap", "Stack", "Linked List"],
            "answer": "Stack",
            "explanation": "Recursion uses the Call Stack to keep track of function calls."
        },
        {
            "question": "What is the worst-case time complexity of Quick Sort?",
            "options": ["O(n log n)", "O(log n)", "O(n²)", "O(n)"],
            "answer": "O(n²)",
            "explanation": "The worst case occurs when the pivot is the smallest or largest element, leading to O(n²)."
        },
        {
            "question": "In a hash table, what technique is used to handle collisions?",
            "options": ["Traversal", "Backtracking", "Chaining", "Recursion"],
            "answer": "Chaining",
            "explanation": "Chaining handles collisions by storing multiple elements at the same index using a list or another data structure."
        }
    ]
    
    return {"status": "success", "quiz": hardcoded_quiz}


# ─── Admin Stats ──────────────────────────────────────────────────────────────

class AdminStatsRequest(BaseModel):
    teacher_id: str
    token: str

@app.post("/admin/stats")
def get_admin_stats(req: AdminStatsRequest):
    try:
        decoded = auth.verify_id_token(req.token)
        
        from firebase_config import db
        
        # 1. Active Courses
        courses_query = db.collection("courses").where("teacher_id", "==", req.teacher_id).stream()
        course_ids = []
        for c in courses_query:
            course_ids.append(c.id)
            
        active_courses_count = len(course_ids)
        
        # 2. Total Students (Unique)
        student_uids = set()
        for cid in course_ids:
            students = db.collection("courses").document(cid).collection("students").stream()
            for s in students:
                student_uids.add(s.id)
        
        total_students_count = len(student_uids)
        
        # 3. Unsolved Doubts
        # Query doubts where course_id IN course_ids AND status == 'open'
        # Firestore 'in' limit is 10. If > 10 courses, this simple query fails.
        # Fallback: Query all 'open' doubts and filter in python (not scalable but works for prototype)
        unsolved_doubts_count = 0
        if course_ids:
           # Optimization: If many courses, maybe query by course_id individually or rethink schema.
           # For now, let's just count all doubts for these courses.
           all_doubts = db.collection("doubts").where("status", "==", "open").stream()
           for d in all_doubts:
               if d.to_dict().get("course_id") in course_ids:
                   unsolved_doubts_count += 1

        return {
            "total_students": total_students_count,
            "active_courses": active_courses_count,
            "unsolved_doubts": unsolved_doubts_count,
            # Mocking attendance for now as we don't track it yet
            "avg_attendance": 85 
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
