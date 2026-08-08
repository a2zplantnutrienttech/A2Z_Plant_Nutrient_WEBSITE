#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for A2Z Plant Nutrient API
Tests all endpoints including CRUD operations, authentication, and data seeding
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Backend URL - using internal URL since we're testing from within the container
BASE_URL = "http://0.0.0.0:8001/api"
ADMIN_TOKEN = "A2Z-Admin-2026-Secure"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.tests = []
    
    def add_pass(self, test_name: str, details: str = ""):
        self.passed += 1
        self.tests.append({
            "name": test_name,
            "status": "PASS",
            "details": details
        })
        print(f"{Colors.GREEN}✓{Colors.RESET} {test_name}")
        if details:
            print(f"  {Colors.BLUE}{details}{Colors.RESET}")
    
    def add_fail(self, test_name: str, error: str):
        self.failed += 1
        self.tests.append({
            "name": test_name,
            "status": "FAIL",
            "error": error
        })
        print(f"{Colors.RED}✗{Colors.RESET} {test_name}")
        print(f"  {Colors.RED}Error: {error}{Colors.RESET}")
    
    def print_summary(self):
        total = self.passed + self.failed
        print(f"\n{Colors.BOLD}{'='*60}{Colors.RESET}")
        print(f"{Colors.BOLD}Test Summary{Colors.RESET}")
        print(f"{Colors.BOLD}{'='*60}{Colors.RESET}")
        print(f"Total Tests: {total}")
        print(f"{Colors.GREEN}Passed: {self.passed}{Colors.RESET}")
        print(f"{Colors.RED}Failed: {self.failed}{Colors.RESET}")
        
        if self.failed > 0:
            print(f"\n{Colors.RED}{Colors.BOLD}Failed Tests:{Colors.RESET}")
            for test in self.tests:
                if test["status"] == "FAIL":
                    print(f"  - {test['name']}: {test['error']}")
        
        print(f"{Colors.BOLD}{'='*60}{Colors.RESET}\n")
        return self.failed == 0

results = TestResults()

def test_root_endpoint():
    """Test the root API endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and "A2Z Plant Nutrient API" in data.get("message", ""):
                results.add_pass("Root Endpoint", f"Status: {response.status_code}, Message: {data.get('message')}")
            else:
                results.add_fail("Root Endpoint", f"Unexpected response: {data}")
        else:
            results.add_fail("Root Endpoint", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Root Endpoint", str(e))

def test_seed_endpoint():
    """Test the seed endpoint (idempotent)"""
    try:
        response = requests.post(f"{BASE_URL}/seed", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                seeded = data.get("seeded", {})
                results.add_pass("Seed Endpoint", f"Seeded: {seeded}")
            else:
                results.add_fail("Seed Endpoint", f"Unexpected response: {data}")
        else:
            results.add_fail("Seed Endpoint", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Seed Endpoint", str(e))

def test_list_blogs():
    """Test listing all blogs"""
    try:
        response = requests.get(f"{BASE_URL}/blogs", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("List Blogs", f"Found {len(data)} blogs")
                return data
            else:
                results.add_fail("List Blogs", f"Expected list, got: {type(data)}")
        else:
            results.add_fail("List Blogs", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("List Blogs", str(e))
    return []

def test_get_blog(slug: str):
    """Test getting a specific blog by slug"""
    try:
        response = requests.get(f"{BASE_URL}/blogs/{slug}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("slug") == slug:
                results.add_pass(f"Get Blog by Slug ({slug})", f"Title: {data.get('title')}")
                return data
            else:
                results.add_fail(f"Get Blog by Slug ({slug})", f"Slug mismatch: {data.get('slug')}")
        else:
            results.add_fail(f"Get Blog by Slug ({slug})", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail(f"Get Blog by Slug ({slug})", str(e))
    return None

def test_create_blog():
    """Test creating a new blog"""
    try:
        payload = {
            "title": "Test Blog Post for API Testing",
            "excerpt": "This is a test blog post created by the automated test suite",
            "content": "This is the full content of the test blog post. It contains detailed information about the testing process.",
            "author": "Test Suite",
            "category": "Testing",
            "tags": ["test", "automation", "api"],
            "cover_image": "/test-image.jpg"
        }
        response = requests.post(f"{BASE_URL}/blogs", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("id") and data.get("slug"):
                results.add_pass("Create Blog", f"Created blog with ID: {data.get('id')}, Slug: {data.get('slug')}")
                return data
            else:
                results.add_fail("Create Blog", f"Missing id or slug in response: {data}")
        else:
            results.add_fail("Create Blog", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Create Blog", str(e))
    return None

def test_update_blog(blog_id: str):
    """Test updating a blog"""
    try:
        payload = {
            "title": "Updated Test Blog Post",
            "excerpt": "This blog post has been updated",
            "content": "Updated content for the test blog post.",
            "author": "Test Suite Updated",
            "category": "Testing",
            "tags": ["test", "updated"],
            "cover_image": "/updated-image.jpg"
        }
        response = requests.put(f"{BASE_URL}/blogs/{blog_id}", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("title") == payload["title"]:
                results.add_pass("Update Blog", f"Updated blog ID: {blog_id}")
                return data
            else:
                results.add_fail("Update Blog", f"Title not updated correctly: {data.get('title')}")
        else:
            results.add_fail("Update Blog", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Update Blog", str(e))
    return None

def test_delete_blog(blog_id: str):
    """Test deleting a blog"""
    try:
        response = requests.delete(f"{BASE_URL}/blogs/{blog_id}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and data.get("deleted") == blog_id:
                results.add_pass("Delete Blog", f"Deleted blog ID: {blog_id}")
                return True
            else:
                results.add_fail("Delete Blog", f"Unexpected response: {data}")
        else:
            results.add_fail("Delete Blog", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Delete Blog", str(e))
    return False

def test_list_media():
    """Test listing all media"""
    try:
        response = requests.get(f"{BASE_URL}/media", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("List Media", f"Found {len(data)} media items")
                return data
            else:
                results.add_fail("List Media", f"Expected list, got: {type(data)}")
        else:
            results.add_fail("List Media", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("List Media", str(e))
    return []

def test_create_media():
    """Test creating a new media item"""
    try:
        payload = {
            "title": "Test Media Item",
            "description": "This is a test media item",
            "category": "Testing",
            "media_type": "image",
            "data": "https://example.com/test-image.jpg"
        }
        response = requests.post(f"{BASE_URL}/media", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("id"):
                results.add_pass("Create Media", f"Created media with ID: {data.get('id')}")
                return data
            else:
                results.add_fail("Create Media", f"Missing id in response: {data}")
        else:
            results.add_fail("Create Media", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Create Media", str(e))
    return None

def test_delete_media(media_id: str):
    """Test deleting a media item"""
    try:
        response = requests.delete(f"{BASE_URL}/media/{media_id}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and data.get("deleted") == media_id:
                results.add_pass("Delete Media", f"Deleted media ID: {media_id}")
                return True
            else:
                results.add_fail("Delete Media", f"Unexpected response: {data}")
        else:
            results.add_fail("Delete Media", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Delete Media", str(e))
    return False

def test_upload_media_zip():
    """Test uploading a ZIP file with multiple images"""
    import zipfile
    import io
    import tempfile
    from PIL import Image
    
    try:
        # Create a temporary ZIP file with test images
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Create 3 test images
            for i in range(1, 4):
                img = Image.new('RGB', (100, 100), color=(255, 0, 0))
                img_buffer = io.BytesIO()
                img.save(img_buffer, format='PNG')
                img_buffer.seek(0)
                zip_file.writestr(f'test_image_{i}.png', img_buffer.getvalue())
        
        zip_buffer.seek(0)
        
        # Prepare multipart form data
        files = {'file': ('test_images.zip', zip_buffer, 'application/zip')}
        data = {
            'title': 'Test ZIP Upload',
            'category': 'Testing',
            'media_type': 'image',
            'description': 'Test ZIP upload from automated test suite'
        }
        
        response = requests.post(f"{BASE_URL}/media/zip", files=files, data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("ok") and result.get("uploaded") == 3:
                results.add_pass("Upload Media ZIP", f"Successfully uploaded {result.get('uploaded')} images from ZIP")
                return result.get("media", [])
            else:
                results.add_fail("Upload Media ZIP", f"Unexpected response: {result}")
        else:
            results.add_fail("Upload Media ZIP", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Upload Media ZIP", str(e))
    return []

def test_list_careers():
    """Test listing all careers"""
    try:
        response = requests.get(f"{BASE_URL}/careers", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("List Careers", f"Found {len(data)} career postings")
                return data
            else:
                results.add_fail("List Careers", f"Expected list, got: {type(data)}")
        else:
            results.add_fail("List Careers", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("List Careers", str(e))
    return []

def test_create_career():
    """Test creating a new career posting"""
    try:
        payload = {
            "title": "Test Position - Software Engineer",
            "type": "Full-time",
            "location": "Test Location",
            "desc": "This is a test career posting created by the automated test suite."
        }
        response = requests.post(f"{BASE_URL}/careers", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("id"):
                results.add_pass("Create Career", f"Created career with ID: {data.get('id')}")
                return data
            else:
                results.add_fail("Create Career", f"Missing id in response: {data}")
        else:
            results.add_fail("Create Career", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Create Career", str(e))
    return None

def test_delete_career(career_id: str):
    """Test deleting a career posting"""
    try:
        response = requests.delete(f"{BASE_URL}/careers/{career_id}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and data.get("deleted") == career_id:
                results.add_pass("Delete Career", f"Deleted career ID: {career_id}")
                return True
            else:
                results.add_fail("Delete Career", f"Unexpected response: {data}")
        else:
            results.add_fail("Delete Career", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Delete Career", str(e))
    return False

def test_create_contact():
    """Test creating a contact message"""
    try:
        payload = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "subject": "Test Contact Message",
            "message": "This is a test contact message from the automated test suite."
        }
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("id"):
                results.add_pass("Create Contact", f"Created contact with ID: {data.get('id')}")
                return data
            else:
                results.add_fail("Create Contact", f"Missing id in response: {data}")
        else:
            results.add_fail("Create Contact", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Create Contact", str(e))
    return None

def test_create_profile_request():
    """Test creating a profile request"""
    try:
        payload = {
            "name": "Jane Smith",
            "organization": "Test Organization",
            "designation": "Project Manager",
            "email": "jane.smith@example.com",
            "phone": "+1234567890",
            "tender_ref": "TEST-2026-001",
            "message": "This is a test profile request from the automated test suite."
        }
        response = requests.post(f"{BASE_URL}/profile-requests", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("id"):
                results.add_pass("Create Profile Request", f"Created profile request with ID: {data.get('id')}")
                return data
            else:
                results.add_fail("Create Profile Request", f"Missing id in response: {data}")
        else:
            results.add_fail("Create Profile Request", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Create Profile Request", str(e))
    return None

def test_list_profile_requests():
    """Test listing all profile requests"""
    try:
        response = requests.get(f"{BASE_URL}/profile-requests", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("List Profile Requests", f"Found {len(data)} profile requests")
                return data
            else:
                results.add_fail("List Profile Requests", f"Expected list, got: {type(data)}")
        else:
            results.add_fail("List Profile Requests", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("List Profile Requests", str(e))
    return []

def test_admin_login():
    """Test admin authentication"""
    try:
        payload = {"password": ADMIN_TOKEN}
        response = requests.post(f"{BASE_URL}/admin-auth", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                # Check if cookie is set
                cookies = response.cookies
                if "a2z_admin" in cookies:
                    results.add_pass("Admin Login", "Successfully authenticated and cookie set")
                else:
                    results.add_pass("Admin Login", "Authenticated but cookie not found in response")
                return True
            else:
                results.add_fail("Admin Login", f"Unexpected response: {data}")
        else:
            results.add_fail("Admin Login", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.add_fail("Admin Login", str(e))
    return False

def test_admin_logout():
    """Test admin logout"""
    try:
        response = requests.delete(f"{BASE_URL}/admin-auth", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                results.add_pass("Admin Logout", "Successfully logged out")
                return True
            else:
                results.add_fail("Admin Logout", f"Unexpected response: {data}")
        else:
            results.add_fail("Admin Logout", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Admin Logout", str(e))
    return False

def test_blog_search():
    """Test blog search functionality"""
    try:
        response = requests.get(f"{BASE_URL}/blogs?q=tender", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("Blog Search", f"Search returned {len(data)} results")
                return data
            else:
                results.add_fail("Blog Search", f"Expected list, got: {type(data)}")
        else:
            results.add_fail("Blog Search", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Blog Search", str(e))
    return []

def test_blog_category_filter():
    """Test blog category filtering"""
    try:
        response = requests.get(f"{BASE_URL}/blogs?category=EPC Insights", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("Blog Category Filter", f"Filter returned {len(data)} results")
                return data
            else:
                results.add_fail("Blog Category Filter", f"Expected list, got: {type(data)}")
        else:
            results.add_fail("Blog Category Filter", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Blog Category Filter", str(e))
    return []

def test_media_category_filter():
    """Test media category filtering"""
    try:
        response = requests.get(f"{BASE_URL}/media?category=Landscaping", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.add_pass("Media Category Filter", f"Filter returned {len(data)} results")
                return data
            else:
                results.add_fail("Media Category Filter", f"Expected list, got: {type(data)}")
        else:
            results.add_fail("Media Category Filter", f"Status code: {response.status_code}")
    except Exception as e:
        results.add_fail("Media Category Filter", str(e))
    return []

def run_all_tests():
    """Run all backend API tests"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}A2Z Plant Nutrient API - Backend Test Suite{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    # Basic endpoint tests
    print(f"{Colors.BOLD}Testing Basic Endpoints...{Colors.RESET}")
    test_root_endpoint()
    test_seed_endpoint()
    
    # Blog tests
    print(f"\n{Colors.BOLD}Testing Blog Endpoints...{Colors.RESET}")
    blogs = test_list_blogs()
    if blogs:
        test_get_blog(blogs[0]["slug"])
    test_blog_search()
    test_blog_category_filter()
    
    # Blog CRUD operations
    print(f"\n{Colors.BOLD}Testing Blog CRUD Operations...{Colors.RESET}")
    created_blog = test_create_blog()
    if created_blog:
        test_update_blog(created_blog["id"])
        test_delete_blog(created_blog["id"])
    
    # Media tests
    print(f"\n{Colors.BOLD}Testing Media Endpoints...{Colors.RESET}")
    test_list_media()
    test_media_category_filter()
    created_media = test_create_media()
    if created_media:
        test_delete_media(created_media["id"])
    
    # Test ZIP upload
    print(f"\n{Colors.BOLD}Testing ZIP Upload Feature...{Colors.RESET}")
    uploaded_media = test_upload_media_zip()
    # Clean up uploaded test media
    for media in uploaded_media:
        if media.get("id"):
            test_delete_media(media["id"])
    
    # Career tests
    print(f"\n{Colors.BOLD}Testing Career Endpoints...{Colors.RESET}")
    test_list_careers()
    created_career = test_create_career()
    if created_career:
        test_delete_career(created_career["id"])
    
    # Contact and Profile Request tests
    print(f"\n{Colors.BOLD}Testing Contact & Profile Request Endpoints...{Colors.RESET}")
    test_create_contact()
    test_create_profile_request()
    test_list_profile_requests()
    
    # Admin authentication tests
    print(f"\n{Colors.BOLD}Testing Admin Authentication...{Colors.RESET}")
    test_admin_login()
    test_admin_logout()
    
    # Print summary
    success = results.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(run_all_tests())
