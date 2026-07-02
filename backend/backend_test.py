"""Backend API Testing for KYPAU Portfolio"""
import requests
import sys
from datetime import datetime

class KYPAUAPITester:
    def __init__(self, base_url="https://pentester-labs.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        req_headers = {'Content-Type': 'application/json'}
        if headers:
            req_headers.update(headers)
        if self.token and 'Authorization' not in req_headers:
            req_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=req_headers, timeout=15)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=req_headers, timeout=15)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=req_headers, timeout=15)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=req_headers, timeout=15)
            elif method == 'DELETE':
                response = requests.delete(url, headers=req_headers, timeout=15)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")

            try:
                return success, response.json() if response.text else {}
            except:
                return success, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_portfolio(self):
        """Test GET /api/portfolio"""
        success, response = self.run_test(
            "GET /api/portfolio",
            "GET",
            "portfolio",
            200
        )
        if success:
            # Verify profile name
            profile = response.get('profile', {})
            if profile.get('name') == 'MUHAMMAD DZAKY FAUZAN':
                print("   ✓ Profile name correct")
            else:
                print(f"   ✗ Profile name incorrect: {profile.get('name')}")
                self.failed_tests.append("Portfolio: Profile name mismatch")
            
            # Verify counts
            skills = response.get('skills', [])
            projects = response.get('projects', [])
            achievements = response.get('achievements', [])
            certifications = response.get('certifications', [])
            experiences = response.get('experiences', [])
            bug_bounty = response.get('bug_bounty', {})
            
            print(f"   Skills: {len(skills)} (expected >=15)")
            print(f"   Projects: {len(projects)} (expected >=4)")
            print(f"   Achievements: {len(achievements)} (expected >=10)")
            print(f"   Certifications: {len(certifications)} (expected >=9)")
            print(f"   Experiences: {len(experiences)} (expected >=4)")
            
            severity_dist = bug_bounty.get('severity_distribution', [])
            print(f"   Bug Bounty Severity Distribution: {len(severity_dist)} (expected 7)")
            
            if len(skills) < 15:
                self.failed_tests.append(f"Portfolio: Skills count {len(skills)} < 15")
            if len(projects) < 4:
                self.failed_tests.append(f"Portfolio: Projects count {len(projects)} < 4")
            if len(achievements) < 10:
                self.failed_tests.append(f"Portfolio: Achievements count {len(achievements)} < 10")
            if len(certifications) < 9:
                self.failed_tests.append(f"Portfolio: Certifications count {len(certifications)} < 9")
            if len(experiences) < 4:
                self.failed_tests.append(f"Portfolio: Experiences count {len(experiences)} < 4")
            if len(severity_dist) != 7:
                self.failed_tests.append(f"Portfolio: Severity distribution count {len(severity_dist)} != 7")
        
        return success

    def test_contact_valid(self):
        """Test POST /api/contact with valid payload"""
        success, response = self.run_test(
            "POST /api/contact (valid)",
            "POST",
            "contact",
            200,
            data={
                "name": "Test User",
                "email": "test@example.com",
                "message": "This is a test message from backend_test.py"
            }
        )
        if success:
            if response.get('success') == True and response.get('message') == 'Secure message transmitted.':
                print("   ✓ Response correct")
                return response.get('id')
            else:
                print(f"   ✗ Response incorrect: {response}")
                self.failed_tests.append("Contact: Response format incorrect")
        return None

    def test_contact_invalid(self):
        """Test POST /api/contact with invalid email"""
        success, response = self.run_test(
            "POST /api/contact (invalid email)",
            "POST",
            "contact",
            422,
            data={
                "name": "Test User",
                "email": "invalid-email",
                "message": "This should fail"
            }
        )
        return success

    def test_login_valid(self):
        """Test POST /api/auth/login with valid credentials"""
        success, response = self.run_test(
            "POST /api/auth/login (valid)",
            "POST",
            "auth/login",
            200,
            data={
                "username": "admin",
                "password": "Kypau@2025"
            }
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   ✓ Token received")
            return True
        else:
            print(f"   ✗ No token in response")
            self.failed_tests.append("Login: No access_token in response")
        return False

    def test_login_invalid(self):
        """Test POST /api/auth/login with wrong password"""
        success, response = self.run_test(
            "POST /api/auth/login (invalid)",
            "POST",
            "auth/login",
            401,
            data={
                "username": "admin",
                "password": "wrongpassword"
            }
        )
        return success

    def test_protected_without_token(self):
        """Test protected routes without token"""
        saved_token = self.token
        self.token = None
        
        success1, _ = self.run_test(
            "GET /api/admin/messages (no token)",
            "GET",
            "admin/messages",
            401
        )
        
        success2, _ = self.run_test(
            "GET /api/admin/stats (no token)",
            "GET",
            "admin/stats",
            401
        )
        
        self.token = saved_token
        return success1 and success2

    def test_admin_stats(self):
        """Test GET /api/admin/stats"""
        success, response = self.run_test(
            "GET /api/admin/stats",
            "GET",
            "admin/stats",
            200
        )
        if success:
            required_fields = ['total_views', 'unread_messages', 'vulnerabilities_found', 'project_clicks', 'recent_messages']
            for field in required_fields:
                if field in response:
                    print(f"   ✓ {field}: {response[field] if field != 'recent_messages' else len(response[field])}")
                else:
                    print(f"   ✗ Missing field: {field}")
                    self.failed_tests.append(f"Admin Stats: Missing field {field}")
        return success

    def test_admin_messages(self):
        """Test GET /api/admin/messages"""
        success, response = self.run_test(
            "GET /api/admin/messages",
            "GET",
            "admin/messages",
            200
        )
        if success:
            messages = response.get('messages', [])
            print(f"   ✓ Found {len(messages)} messages")
            return messages
        return []

    def test_message_operations(self, message_id):
        """Test message read, delete operations"""
        if not message_id:
            print("\n⚠️  Skipping message operations - no message ID")
            return False
        
        # Mark as read
        success1, _ = self.run_test(
            f"PATCH /api/admin/messages/{message_id}/read",
            "PATCH",
            f"admin/messages/{message_id}/read",
            200
        )
        
        # Delete message
        success2, _ = self.run_test(
            f"DELETE /api/admin/messages/{message_id}",
            "DELETE",
            f"admin/messages/{message_id}",
            200
        )
        
        return success1 and success2

    def test_analytics(self):
        """Test analytics endpoints"""
        # Track visit
        success1, response1 = self.run_test(
            "POST /api/analytics/track",
            "POST",
            "analytics/track",
            200,
            data={"page": "/", "referrer": ""}
        )
        
        # Get analytics
        success2, response2 = self.run_test(
            "GET /api/admin/analytics",
            "GET",
            "admin/analytics?days=30",
            200
        )
        if success2:
            if 'daily_views' in response2 and 'top_pages' in response2:
                print(f"   ✓ daily_views: {len(response2['daily_views'])} entries")
                print(f"   ✓ top_pages: {len(response2['top_pages'])} entries")
            else:
                self.failed_tests.append("Analytics: Missing daily_views or top_pages")
        
        return success1 and success2

    def test_content_crud(self):
        """Test content CRUD operations"""
        # Create a test project
        test_project = {
            "title": "Test Project",
            "subtitle": "Test Subtitle",
            "description": "Test description",
            "tech_stack": ["Python", "FastAPI"],
            "features": ["Feature 1"],
            "category": "Testing",
            "status": "Completed",
            "order": 999
        }
        
        success1, response1 = self.run_test(
            "POST /api/admin/content/projects",
            "POST",
            "admin/content/projects",
            200,
            data=test_project
        )
        
        project_id = response1.get('id') if success1 else None
        
        if project_id:
            # Update project
            success2, _ = self.run_test(
                f"PUT /api/admin/content/projects/{project_id}",
                "PUT",
                f"admin/content/projects/{project_id}",
                200,
                data={"title": "Updated Test Project"}
            )
            
            # Delete project
            success3, _ = self.run_test(
                f"DELETE /api/admin/content/projects/{project_id}",
                "DELETE",
                f"admin/content/projects/{project_id}",
                200
            )
            
            return success1 and success2 and success3
        
        return success1

    def test_settings(self):
        """Test settings endpoints"""
        success1, response1 = self.run_test(
            "GET /api/admin/settings",
            "GET",
            "admin/settings",
            200
        )
        
        if success1 and response1:
            # Update settings (just update a field)
            success2, _ = self.run_test(
                "PUT /api/admin/settings",
                "PUT",
                "admin/settings",
                200,
                data={"quote": response1.get('quote', 'No System Is Safe.')}
            )
            return success1 and success2
        
        return success1

    def test_github_apis(self):
        """Test GitHub API endpoints"""
        success1, response1 = self.run_test(
            "GET /api/github/repos",
            "GET",
            "github/repos",
            200
        )
        if success1:
            if 'repos' in response1 and 'count' in response1:
                print(f"   ✓ Found {response1['count']} repos")
            else:
                self.failed_tests.append("GitHub Repos: Missing repos or count field")
        
        success2, _ = self.run_test(
            "GET /api/github/org",
            "GET",
            "github/org",
            200
        )
        
        success3, _ = self.run_test(
            "GET /api/github/events",
            "GET",
            "github/events",
            200
        )
        
        return success1 and success2 and success3

    def test_resume(self):
        """Test resume PDF endpoint"""
        url = f"{self.base_url}/resume"
        print(f"\n🔍 Testing GET /api/resume...")
        self.tests_run += 1
        
        try:
            response = requests.get(url, timeout=15)
            if response.status_code == 200 and response.headers.get('content-type') == 'application/pdf':
                self.tests_passed += 1
                print(f"✅ Passed - PDF returned ({len(response.content)} bytes)")
                return True
            else:
                print(f"❌ Failed - Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
                self.failed_tests.append(f"Resume: Expected PDF, got {response.headers.get('content-type')}")
                return False
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"Resume: {str(e)}")
            return False

def main():
    print("=" * 60)
    print("KYPAU Portfolio Backend API Testing")
    print("=" * 60)
    
    tester = KYPAUAPITester()
    
    # Public endpoints
    print("\n📋 PUBLIC ENDPOINTS")
    print("-" * 60)
    tester.test_portfolio()
    message_id = tester.test_contact_valid()
    tester.test_contact_invalid()
    tester.test_resume()
    tester.test_github_apis()
    
    # Auth
    print("\n🔐 AUTHENTICATION")
    print("-" * 60)
    tester.test_login_invalid()
    if not tester.test_login_valid():
        print("\n❌ Login failed, stopping protected route tests")
        print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
        return 1
    
    # Protected endpoints
    print("\n🔒 PROTECTED ENDPOINTS")
    print("-" * 60)
    tester.test_protected_without_token()
    tester.test_admin_stats()
    messages = tester.test_admin_messages()
    tester.test_analytics()
    tester.test_content_crud()
    tester.test_settings()
    
    # Message operations (use the message we created)
    if message_id:
        print("\n📨 MESSAGE OPERATIONS")
        print("-" * 60)
        tester.test_message_operations(message_id)
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS: {tester.tests_passed}/{tester.tests_run} tests passed")
    print("=" * 60)
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            print(f"   • {failure}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
