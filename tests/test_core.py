"""POC core test: auth, contact flow, portfolio data, GitHub proxy, admin CRUD."""
import sys
import requests

BASE = "http://localhost:8001/api"
results = []


def check(name, cond, detail=""):
    status = "PASS" if cond else "FAIL"
    results.append((name, status, detail))
    print(f"[{status}] {name} {detail if not cond else ''}")
    return cond


def main():
    ok = True

    # 1. API root
    r = requests.get(f"{BASE}/")
    ok &= check("API root", r.status_code == 200, f"status={r.status_code}")

    # 2. Portfolio content (seeded)
    r = requests.get(f"{BASE}/portfolio")
    data = r.json() if r.status_code == 200 else {}
    ok &= check("Portfolio content", r.status_code == 200 and data.get("profile", {}).get("name") == "MUHAMMAD DZAKY FAUZAN")
    ok &= check("Seeded projects", len(data.get("projects", [])) >= 3, f"count={len(data.get('projects', []))}")
    ok &= check("Seeded skills", len(data.get("skills", [])) >= 10)
    ok &= check("Seeded achievements", len(data.get("achievements", [])) >= 8)
    ok &= check("Seeded certifications", len(data.get("certifications", [])) >= 8)
    ok &= check("Bug bounty data", len(data.get("bug_bounty", {}).get("severity_distribution", [])) == 7)

    # 3. Contact message submit
    r = requests.post(f"{BASE}/contact", json={"name": "POC Tester", "email": "poc@test.com", "message": "Core POC test message - hello from the matrix"})
    ok &= check("Contact submit", r.status_code == 200 and r.json().get("success"), f"status={r.status_code} body={r.text[:200]}")

    # 4. Contact validation rejects bad email
    r = requests.post(f"{BASE}/contact", json={"name": "X", "email": "notanemail", "message": "hi"})
    ok &= check("Contact validation", r.status_code == 422, f"status={r.status_code}")

    # 5. Login with wrong password fails
    r = requests.post(f"{BASE}/auth/login", json={"username": "admin", "password": "wrong"})
    ok &= check("Login rejects bad password", r.status_code == 401)

    # 6. Login with correct creds
    r = requests.post(f"{BASE}/auth/login", json={"username": "admin", "password": "Kypau@2025"})
    token = r.json().get("access_token") if r.status_code == 200 else None
    ok &= check("Admin login", bool(r.status_code == 200 and token), f"status={r.status_code} body={r.text[:200]}")
    if not token:
        print("Cannot continue without token")
        sys.exit(1)
    H = {"Authorization": f"Bearer {token}"}

    # 7. Protected route without token
    r = requests.get(f"{BASE}/admin/messages")
    ok &= check("Admin route blocks anon", r.status_code in (401, 403), f"status={r.status_code}")

    # 8. Admin inbox contains the message
    r = requests.get(f"{BASE}/admin/messages", headers=H)
    msgs = r.json().get("messages", []) if r.status_code == 200 else []
    found = any(m["name"] == "POC Tester" for m in msgs)
    ok &= check("Inbox shows message", found, f"status={r.status_code} count={len(msgs)}")

    # 9. Mark read + delete message
    if found:
        mid = next(m["id"] for m in msgs if m["name"] == "POC Tester")
        r = requests.patch(f"{BASE}/admin/messages/{mid}/read", headers=H)
        ok &= check("Mark message read", r.status_code == 200)
        r = requests.delete(f"{BASE}/admin/messages/{mid}", headers=H)
        ok &= check("Delete message", r.status_code == 200)

    # 10. Admin stats
    r = requests.get(f"{BASE}/admin/stats", headers=H)
    ok &= check("Admin stats", r.status_code == 200 and "vulnerabilities_found" in r.json(), f"status={r.status_code}")

    # 11. Analytics track + count
    r = requests.post(f"{BASE}/analytics/track", json={"page": "/", "referrer": "poc"})
    ok &= check("Analytics track", r.status_code == 200)
    r = requests.get(f"{BASE}/admin/analytics", headers=H)
    ok &= check("Admin analytics", r.status_code == 200 and "daily_views" in r.json())

    # 12. Content CRUD (projects)
    r = requests.post(f"{BASE}/admin/content/projects", headers=H, json={"title": "POC Project", "category": "Test", "order": 99})
    pid = r.json().get("id") if r.status_code == 200 else None
    ok &= check("Create project", bool(r.status_code == 200 and pid), f"status={r.status_code}")
    if pid:
        r = requests.put(f"{BASE}/admin/content/projects/{pid}", headers=H, json={"title": "POC Project Updated"})
        ok &= check("Update project", r.status_code == 200 and r.json().get("title") == "POC Project Updated")
        r = requests.delete(f"{BASE}/admin/content/projects/{pid}", headers=H)
        ok &= check("Delete project", r.status_code == 200)

    # 13. GitHub proxy (live API)
    r = requests.get(f"{BASE}/github/repos", timeout=30)
    repos_ok = r.status_code == 200 and "repos" in r.json()
    ok &= check("GitHub repos proxy", repos_ok, f"status={r.status_code} body={r.text[:200]}")
    if repos_ok:
        print(f"    -> {r.json()['count']} repos fetched from kypau-org")
    r = requests.get(f"{BASE}/github/org", timeout=30)
    ok &= check("GitHub org proxy", r.status_code == 200, f"status={r.status_code}")

    # 14. Media upload/list/delete
    r = requests.post(f"{BASE}/admin/media", headers=H, json={"name": "test.png", "data": "data:image/png;base64,iVBORw0KGgo=", "content_type": "image/png"})
    mid = r.json().get("id") if r.status_code == 200 else None
    ok &= check("Media upload", bool(r.status_code == 200 and mid))
    if mid:
        r = requests.delete(f"{BASE}/admin/media/{mid}", headers=H)
        ok &= check("Media delete", r.status_code == 200)

    # 15. Settings get/update
    r = requests.get(f"{BASE}/admin/settings", headers=H)
    ok &= check("Get settings", bool(r.status_code == 200 and r.json().get("name")))
    r = requests.put(f"{BASE}/admin/settings", headers=H, json={"quote": "No System Is Safe."})
    ok &= check("Update settings", r.status_code == 200)

    # 16. Activity logs
    r = requests.get(f"{BASE}/admin/logs", headers=H)
    ok &= check("Activity logs", r.status_code == 200 and len(r.json().get("logs", [])) > 0)

    print("\n" + ("=" * 50))
    fails = [r for r in results if r[1] == "FAIL"]
    print(f"TOTAL: {len(results)} | PASS: {len(results) - len(fails)} | FAIL: {len(fails)}")
    if fails:
        print("FAILED:", [f[0] for f in fails])
        sys.exit(1)
    print("ALL CORE TESTS PASSED ✓")


if __name__ == "__main__":
    main()
