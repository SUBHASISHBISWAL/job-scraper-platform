import os
import io
import re
from typing import List, Dict, Optional
import PyPDF2

import math
from collections import Counter

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    text = ""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages:
            text += page.extract_text() or ""
    except Exception:
        pass
    return text.strip()

def parse_resume_skills(text: str) -> List[str]:
    common_skills = [
        "python", "javascript", "typescript", "react", "vue", "angular", "node",
        "fastapi", "express", "django", "flask", "postgresql", "mysql", "mongodb",
        "aws", "docker", "kubernetes", "git", "html", "css", "tailwind"
    ]
    extracted = []
    text_lower = text.lower()
    for skill in common_skills:
        if re.search(rf"\b{skill}\b", text_lower):
            extracted.append(skill.title())
    return extracted

def calculate_cosine_similarity(text1: str, text2: str) -> float:
    words1 = re.findall(r"\b\w+\b", text1.lower())
    words2 = re.findall(r"\b\w+\b", text2.lower())
    
    if not words1 or not words2:
        return 0.0
        
    vec1 = Counter(words1)
    vec2 = Counter(words2)
    
    intersection = set(vec1.keys()) & set(vec2.keys())
    dot_product = sum(vec1[x] * vec2[x] for x in intersection)
    
    sum1 = sum(val ** 2 for val in vec1.values())
    sum2 = sum(val ** 2 for val in vec2.values())
    norm1 = math.sqrt(sum1)
    norm2 = math.sqrt(sum2)
    
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
        
    return dot_product / (norm1 * norm2)

def calculate_match_score(resume_text: str, job_title: str, job_description: str) -> dict:
    if not resume_text:
        return {"score": 0, "feedback": "No resume text found."}
        
    try:
        similarity = calculate_cosine_similarity(resume_text, f"{job_title} {job_description}")
        score = int(similarity * 100)
    except Exception:
        score = 30

    feedback = [
        "Match score calculated using key skills overlap.",
        "Consider adding more keywords relating to the job requirements to increase compatibility."
    ]
    return {
        "score": min(score + 25, 100),
        "feedback": " ".join(feedback)
    }


def rank_jobs_by_resume(resume_text: str, jobs: List[dict]) -> List[dict]:
    if not resume_text:
        return jobs
        
    ranked_jobs = []
    for job in jobs:
        analysis = calculate_match_score(resume_text, job.get("title", ""), job.get("company", ""))
        job_copy = job.copy()
        job_copy["match_score"] = analysis["score"]
        ranked_jobs.append(job_copy)
        
    # Sort descending
    ranked_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)
    return ranked_jobs

def summarize_job_post(title: str, company: str, location: str) -> str:
    return f"This is a {title} position at {company} located in {location}. It offers matching career options in modern tech stacks."

KEYWORD_RESPONSES = [
    (
        ["devop"],
        "DevOps is the integration of Software Development (Dev) and IT Operations (Ops). "
        "It centers around automating deployment pipelines using Continuous Integration/Continuous Deployment (CI/CD) "
        "tools (like GitHub Actions, Jenkins), containerization (Docker, Kubernetes), and cloud infrastructure (AWS/GCP)."
    ),
    (
        ["bio", "summ"],
        "Here is a professional SDE bio template for your profile:\n\n"
        "\"Passionate Full Stack Engineer with expertise in building scalable, secure web platforms. "
        "Proficient in Python (FastAPI) and Javascript (React/Node.js) with a solid foundation in relational database design "
        "and RESTful APIs. Eager to solve complex software engineering challenges and contribute to high-impact dev teams.\""
    ),
    (
        ["fastapi", "fast api"],
        "FastAPI is a modern, high-performance web framework for building APIs with Python. "
        "It is extremely fast (comparable to NodeJS and Go), fully supports asynchronous code (async/await), "
        "and automatically generates interactive OpenAPI/Swagger documentation out of the box."
    ),
    (
        ["react"],
        "React is a component-based Javascript library for building user interfaces, maintained by Meta. "
        "It utilizes a Virtual DOM for fast, dynamic rendering and uses Hooks (useState, useEffect) "
        "for state management. Perfect for building single-page SaaS applications."
    ),
    (
        ["database", "sql", "postgres", " db "],
        "PostgreSQL is a powerful, open-source object-relational database. SDE interviews "
        "frequently test database normalization, ACID transaction properties, indexing, "
        "and query optimization (reducing execution times for complex JOIN statements)."
    ),
    (
        ["dsa", "algo", "leet"],
        "Data Structures and Algorithms (DSA) form the core of SDE technical interviews. "
        "Focus on mastering: Arrays, Strings, HashMaps, Two-Pointers, BFS/DFS tree traversals, "
        "and basic Dynamic Programming. Practice solving 1-2 problems daily on LeetCode."
    ),
    (
        ["git"],
        "Git is a distributed version control system. Important SDE practices include "
        "branch management (feature branches), clear commit messaging, pull request reviews, "
        "and conflict resolution (rebasing vs merging)."
    ),
    (
        ["docker", "kubern", "container", "k8s"],
        "Docker packages applications into containers to guarantee they run consistently on any environment. "
        "It ensures consistent deployment across developer machines and cloud instances."
    ),
    (
        ["aws", "cloud", "gcp", "azure"],
        "Cloud providers offer scale-on-demand virtual infrastructure. Key concepts include virtual machines "
        "(EC2), managed relational databases (RDS), secure object storage (S3), and serverless functions (Lambda)."
    ),
    (
        ["full stack", "fullstack"],
        "A Full Stack Developer designs both frontend client interfaces and backend databases/APIs. "
        "Typical modern stack: HTML/Tailwind CSS + React/Vue (Frontend) coupled with Python/Node.js/FastAPI (Backend) "
        "and PostgreSQL/MongoDB (Database). For SDE-1 roles, focus on showing end-to-end deployment records."
    ),
    (
        ["frontend", "front-end"],
        "Frontend Developers focus on creating responsive, visual user interfaces. Key technologies "
        "include HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, and framework libraries like React or Vue.js. "
        "To excel, focus on performance, accessibility standards (WCAG), and smooth animations."
    ),
    (
        ["backend", "back-end"],
        "Backend Developers manage database configurations, server scaling, and API structures. "
        "Prominent backend stacks include Python (FastAPI, Django), Node.js (Express), and Go. "
        "SDE-1 backend requirements focus heavily on SQL/NoSQL databases, RESTful API design, and authentication models."
    ),
    (
        ["devolp", "develop", "engin", "sde"],
        "Software Development Engineers (SDEs) build and optimize software solutions. SDE-1 evaluations "
        "focus heavily on data structures and algorithms (DSA), problem-solving skills, and clean coding "
        "practices. I recommend tailoring your resume with framework-specific projects to stand out."
    ),
    (
        ["project", "portfol"],
        "Excellent portfolio projects to stand out for SDE-1 applications: "
        "1. An automated Multi-Source Job Scraper (like this platform!), "
        "2. A secure E-Commerce/CRUD application with JWT session checks, "
        "3. A Dockerized API setup with database migrations. Ensure your GitHub repos feature clean commit logs and descriptive README files."
    ),
    (
        ["skill", "resum", "cv"],
        "Looking at your profile skills ({skills_list}), you have a strong SDE-1 base. To stand out, consider adding deployment keywords like Docker, AWS, or CI/CD pipelines to your resume."
    ),
    (
        ["job", "recommend", "career"],
        "I recommend crawling for 'Full Stack Engineer' or 'FastAPI Developer' roles in Bangalore or Hyderabad. These stacks align perfectly with SDE hiring trends."
    ),
    (
        ["interview", "prepare"],
        "For SDE-1 roles, focus on: 1. Data Structures (Arrays, Strings, Trees), 2. System design basics (APIs, DB indexing), 3. Project walkthroughs. Shall I list sample questions?"
    ),
    (
        ["python"],
        "Python is a versatile, high-level programming language widely used in backend development, data science, and AI. In SDE roles, Python is highly valued for frameworks like FastAPI/Django and scripting automation."
    ),
    (
        ["javascript", " js ", "typescript", " ts "],
        "JavaScript and TypeScript are the backbone of modern web applications. TypeScript adds static typing to JavaScript, making it preferred for scalable frontend (React/Vue) and backend (Node.js) platforms."
    ),
    (
        ["who", "name"],
        "I am HireKarma AI, your career advisor. I can help you optimize your resume, prepare for SDE-1 interviews, analyze job descriptions, and suggest custom career paths!"
    ),
    (
        ["hi", "hello", "hey"],
        "Hello! I am your HireKarma Career Companion. How can I help you build your resume, find matching SDE jobs, or prepare for interviews today?"
    )
]

def format_response_skills(response: str, skills_list: str) -> str:
    if "{skills_list}" in response:
        return response.format(skills_list=skills_list)
    return response

def try_gemini_api(message: str, user_skills: str) -> Optional[str]:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            f"You are HireKarma AI, a helpful SDE career advisor. "
            f"The user has profile skills: {user_skills}. "
            f"Please answer their question: '{message}' in a concise, professional, supportive SDE career context."
        )
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
    except Exception:
        pass
    return None

def find_static_response(message: str, user_skills: str) -> Optional[str]:
    msg_lower = f" {message.lower()} "
    skills_list = user_skills or "none listed yet"
    for keywords, response in KEYWORD_RESPONSES:
        if any(keyword in msg_lower for keyword in keywords):
            return format_response_skills(response, skills_list)
    return None

def get_fallback_message(message: str, user_skills: str) -> str:
    skills_list = user_skills or "none listed yet"
    clean_msg = message[:50]
    return (
        f"As your HireKarma Career Advisor, I've analyzed your question: '{clean_msg}...'. "
        f"Based on your profile skills ({skills_list}), here is some guidance:\n\n"
        f"To excel as an SDE, focus on building strong foundational projects, practicing DSA, "
        f"and tailoring your resume to the specific job descriptions you are targeting. "
        f"Let me know if you want tips on specific frameworks like FastAPI, React, DevOps, or resume building!"
        f"\n\n(Tip: To enable advanced AI reasoning for arbitrary topics, configure a 'GEMINI_API_KEY' in the backend .env file)"
    )

def chat_with_advisor(message: str, user_skills: str) -> str:
    gemini_reply = try_gemini_api(message, user_skills)
    if gemini_reply:
        return gemini_reply
        
    static_reply = find_static_response(message, user_skills)
    if static_reply:
        return static_reply
        
    return get_fallback_message(message, user_skills)



