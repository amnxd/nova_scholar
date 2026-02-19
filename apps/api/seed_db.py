"""
seed_db.py — Seed Firestore with dummy data for Manan AI
Run: python seed_db.py
"""

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import random

# ──────────────────────────────────────────────
# 1. Initialization
# ──────────────────────────────────────────────
cred = credentials.Certificate("nova-scholar-f10d5-firebase-adminsdk-fbsvc-9ac6252f8f.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


# ──────────────────────────────────────────────
# 2A. Users Collection (1 Admin + 5 Students)
# ──────────────────────────────────────────────
def seed_users():
    print("Seeding Users...")

    # Admin
    db.collection("users").document("admin_123").set({
        "uid": "admin_123",
        "role": "admin",
        "email": "admin@manan.ai",
        "profile": {
            "name": "Admin User",
            "avatar_url": "",
        },
        "created_at": datetime.utcnow(),
    })

    # Students — 2 "At Risk", 3 "Safe"
    students = [
        {
            "uid": "student_1",
            "name": "Rahul Sharma",
            "email": "rahul@manan.ai",
            "attendance": 58,
            "cgpa": 4.2,
            "risk_status": "At Risk",
        },
        {
            "uid": "student_2",
            "name": "Priya Patel",
            "email": "priya@manan.ai",
            "attendance": 62,
            "cgpa": 4.8,
            "risk_status": "At Risk",
        },
        {
            "uid": "student_3",
            "name": "Amit Verma",
            "email": "amit@manan.ai",
            "attendance": 88,
            "cgpa": 7.9,
            "risk_status": "Safe",
        },
        {
            "uid": "student_4",
            "name": "Sneha Gupta",
            "email": "sneha@manan.ai",
            "attendance": 91,
            "cgpa": 8.5,
            "risk_status": "Safe",
        },
        {
            "uid": "student_5",
            "name": "Vikram Singh",
            "email": "vikram@manan.ai",
            "attendance": 82,
            "cgpa": 7.1,
            "risk_status": "Safe",
        },
    ]

    for s in students:
        db.collection("users").document(s["uid"]).set({
            "uid": s["uid"],
            "role": "student",
            "email": s["email"],
            "profile": {
                "name": s["name"],
                "branch": "CSE",
                "year": 3,
                "avatar_url": "",
            },
            "academic_stats": {
                "attendance_percent": s["attendance"],
                "cgpa": s["cgpa"],
                "risk_status": s["risk_status"],
                "courses_enrolled": ["CS301", "CS302", "CS303"],
            },
            "created_at": datetime.utcnow(),
        })

    print(f"  [OK] Created 1 admin + {len(students)} students.")


# ──────────────────────────────────────────────
# 2B. Courses Collection (3 CSE Courses)
# ──────────────────────────────────────────────
def seed_courses():
    print("Seeding Courses...")

    courses = [
        {
            "course_id": "CS301",
            "title": "Operating Systems",
            "code": "CS301",
            "department": "CSE",
            "semester": 5,
            "instructor": "Dr. Meera Krishnan",
            "syllabus_topics": [
                "Introduction to OS",
                "Process Management",
                "CPU Scheduling Algorithms",
                "Process Synchronization & Deadlocks",
                "Memory Management & Paging",
                "Virtual Memory",
                "File Systems",
                "I/O Systems",
                "Protection & Security",
            ],
            "analytics": {
                "total_students_enrolled": 120,
                "total_doubts_asked": 245,
                "avg_attendance_percent": 78,
                "pass_rate_percent": 82,
            },
        },
        {
            "course_id": "CS302",
            "title": "Database Management Systems",
            "code": "CS302",
            "department": "CSE",
            "semester": 5,
            "instructor": "Prof. Arvind Joshi",
            "syllabus_topics": [
                "Introduction to DBMS",
                "ER Model & Relational Model",
                "SQL — DDL, DML, DCL",
                "Normalization (1NF to BCNF)",
                "Indexing & B-Trees",
                "Transaction Management",
                "Concurrency Control",
                "Recovery Mechanisms",
                "NoSQL Databases Overview",
            ],
            "analytics": {
                "total_students_enrolled": 115,
                "total_doubts_asked": 310,
                "avg_attendance_percent": 81,
                "pass_rate_percent": 88,
            },
        },
        {
            "course_id": "CS303",
            "title": "Computer Networks",
            "code": "CS303",
            "department": "CSE",
            "semester": 5,
            "instructor": "Dr. Sunita Rao",
            "syllabus_topics": [
                "Introduction & OSI Model",
                "TCP/IP Protocol Suite",
                "Data Link Layer & Error Detection",
                "Network Layer — IP Addressing & Routing",
                "Transport Layer — TCP & UDP",
                "Application Layer Protocols (HTTP, DNS, SMTP)",
                "Network Security & Firewalls",
                "Wireless Networks & Mobile IP",
                "Socket Programming Basics",
            ],
            "analytics": {
                "total_students_enrolled": 110,
                "total_doubts_asked": 198,
                "avg_attendance_percent": 76,
                "pass_rate_percent": 79,
            },
        },
    ]

    for c in courses:
        db.collection("courses").document(c["course_id"]).set(c)

    print(f"  [OK] Created {len(courses)} courses.")


# ──────────────────────────────────────────────
# 2C. Doubts Collection (5 chat history records)
# ──────────────────────────────────────────────
def seed_doubts():
    print("Seeding Doubts...")

    doubts = [
        {
            "doubt_id": "doubt_1",
            "student_uid": "student_1",
            "course_id": "CS301",
            "question": "What is a Mutex and how is it different from a Semaphore?",
            "ai_answer": (
                "A Mutex (Mutual Exclusion) is a locking mechanism that allows only one "
                "thread to access a critical section at a time. A Semaphore, on the other "
                "hand, is a signaling mechanism that can allow multiple threads based on its "
                "count value. Key difference: a Mutex has ownership (only the locking thread "
                "can unlock), while a Semaphore does not."
            ),
            "citations": [
                "Silberschatz, Galvin & Gagne — Operating System Concepts, Ch. 6",
                "https://www.geeksforgeeks.org/mutex-vs-semaphore/",
            ],
            "created_at": datetime.utcnow() - timedelta(days=3),
            "status": "resolved",
        },
        {
            "doubt_id": "doubt_2",
            "student_uid": "student_1",
            "course_id": "CS302",
            "question": "Explain B-Trees and why they are used in databases.",
            "ai_answer": (
                "A B-Tree is a self-balancing search tree where each node can have multiple "
                "keys and children. It is designed to work efficiently on disk-based storage "
                "by minimizing the number of I/O operations. Databases use B-Trees for "
                "indexing because they keep data sorted and allow searches, insertions, and "
                "deletions in O(log n) time."
            ),
            "citations": [
                "Ramakrishnan & Gehrke — Database Management Systems, Ch. 10",
                "https://en.wikipedia.org/wiki/B-tree",
            ],
            "created_at": datetime.utcnow() - timedelta(days=5),
            "status": "resolved",
        },
        {
            "doubt_id": "doubt_3",
            "student_uid": "student_2",
            "course_id": "CS303",
            "question": "What is the difference between TCP and UDP?",
            "ai_answer": (
                "TCP (Transmission Control Protocol) is connection-oriented, reliable, and "
                "guarantees ordered delivery via acknowledgments and retransmissions. UDP "
                "(User Datagram Protocol) is connectionless, faster, but does not guarantee "
                "delivery or ordering. TCP is used for HTTP, email; UDP is used for live "
                "streaming, gaming, and DNS lookups."
            ),
            "citations": [
                "Kurose & Ross — Computer Networking: A Top-Down Approach, Ch. 3",
                "https://www.cloudflare.com/learning/ddos/glossary/tcp-udp/",
            ],
            "created_at": datetime.utcnow() - timedelta(days=2),
            "status": "resolved",
        },
        {
            "doubt_id": "doubt_4",
            "student_uid": "student_2",
            "course_id": "CS301",
            "question": "What is thrashing in operating systems?",
            "ai_answer": (
                "Thrashing occurs when a system spends more time swapping pages in and out "
                "of memory than executing actual processes. It happens when the degree of "
                "multiprogramming is too high and the working set of processes exceeds the "
                "available physical memory. Solutions include using the working-set model or "
                "page-fault frequency strategy."
            ),
            "citations": [
                "Silberschatz — Operating System Concepts, Ch. 9.6",
            ],
            "created_at": datetime.utcnow() - timedelta(days=1),
            "status": "resolved",
        },
        {
            "doubt_id": "doubt_5",
            "student_uid": "student_1",
            "course_id": "CS302",
            "question": "What is normalization and what are the normal forms?",
            "ai_answer": (
                "Normalization is the process of organizing a relational database to reduce "
                "data redundancy and improve integrity. The main normal forms are: "
                "1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive "
                "dependencies), and BCNF (every determinant is a candidate key). Higher "
                "forms like 4NF and 5NF deal with multi-valued and join dependencies."
            ),
            "citations": [
                "Elmasri & Navathe — Fundamentals of Database Systems, Ch. 15",
                "https://www.studytonight.com/dbms/database-normalization.php",
            ],
            "created_at": datetime.utcnow() - timedelta(hours=6),
            "status": "pending",
        },
    ]

    for d in doubts:
        db.collection("doubts").document(d["doubt_id"]).set(d)

    print(f"  [OK] Created {len(doubts)} doubt records.")


# ──────────────────────────────────────────────
# 2D. Resume Reviews Collection (2 records)
# ──────────────────────────────────────────────
def seed_resume_reviews():
    print("Seeding Resume Reviews...")

    reviews = [
        {
            "review_id": "review_1",
            "student_uid": "student_1",
            "resume_file": "rahul_sharma_resume_v1.pdf",
            "ats_score": 65,
            "roast_comments": [
                "Your summary reads like a Wikipedia article — make it personal.",
                "Listing 'MS Office' as a skill in 2026? Bold move.",
                "No quantifiable achievements — did you actually DO anything at your internship?",
            ],
            "improvement_tips": [
                "Add metrics: 'Improved API response time by 40%' instead of 'Worked on APIs'.",
                "Move Education below Experience — recruiters care about what you've built.",
                "Add 2-3 relevant projects with tech stack and GitHub links.",
                "Use action verbs: Built, Designed, Optimized — not 'Was responsible for'.",
            ],
            "overall_feedback": "Your resume has potential but needs significant polish to pass ATS filters. Focus on quantifiable impact and relevant technical skills.",
            "created_at": datetime.utcnow() - timedelta(days=7),
        },
        {
            "review_id": "review_2",
            "student_uid": "student_1",
            "resume_file": "rahul_sharma_resume_v2.pdf",
            "ats_score": 78,
            "roast_comments": [
                "Much better! But your projects section still reads like a grocery list.",
                "Font size inconsistency — pick one size and stick with it.",
            ],
            "improvement_tips": [
                "Great improvement on metrics! Now add 1-2 lines about the IMPACT of each project.",
                "Consider adding a 'Certifications' section if you have any cloud/dev certs.",
                "Tailor your skills section to match the job description keywords.",
            ],
            "overall_feedback": "Solid improvement from v1. A few more tweaks and this will be recruiter-ready. ATS score jumped from 65 → 78.",
            "created_at": datetime.utcnow() - timedelta(days=2),
        },
    ]

    for r in reviews:
        db.collection("resume_reviews").document(r["review_id"]).set(r)

    print(f"  [OK] Created {len(reviews)} resume review records.")


# ──────────────────────────────────────────────
# 3. Run All Seeders
# ──────────────────────────────────────────────
if __name__ == "__main__":
    print("\n--- Starting Manan AI DB Seeder ---\n")
    seed_users()
    seed_courses()
    seed_doubts()
    seed_resume_reviews()
    print("\n--- Database successfully seeded! ---\n")
