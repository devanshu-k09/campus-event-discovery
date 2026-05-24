#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Campus Event Discovery Platform — API Testing Script
# Verify all endpoints after PostgreSQL → MySQL migration
# ═══════════════════════════════════════════════════════════════

BASE="http://localhost:3000"

echo "═══════════════════════════════════════════════"
echo "  Campus Event Discovery — API Test Suite"
echo "═══════════════════════════════════════════════"
echo ""

# ─── 1. Register a new user ──────────────────────────────────
echo "1️⃣  Register a new user"
echo "───────────────────────────────────────────────"
curl -s -X POST "$BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@college.edu",
    "password": "Test@123456",
    "collegeName": "Mumbai University",
    "year": "2",
    "department": "Computer Science",
    "interests": ["Tech", "Sports"]
  }' | python -m json.tool 2>/dev/null || echo "(raw response above)"
echo ""
echo ""

# ─── 2. Login (get JWT via NextAuth) ─────────────────────────
echo "2️⃣  Login via NextAuth credentials"
echo "───────────────────────────────────────────────"
echo "   For NextAuth, login via browser at: $BASE/login"
echo "   Or use the CSRF token flow:"
echo ""
echo "   Step A: Get CSRF token"
echo "   curl -s '$BASE/api/auth/csrf'"
echo ""
echo "   Step B: Login with credentials"
echo "   curl -s -X POST '$BASE/api/auth/callback/credentials' \\"
echo "     -H 'Content-Type: application/x-www-form-urlencoded' \\"
echo "     -d 'email=test@college.edu&password=Test@123456&csrfToken=<TOKEN>'"
echo ""
echo ""

# ─── 3. Create draft event (without image) ───────────────────
echo "3️⃣  Create a draft event"
echo "───────────────────────────────────────────────"
echo "   curl -s -X POST '$BASE/api/events' \\"
echo "     -H 'Cookie: next-auth.session-token=<SESSION_TOKEN>' \\"
echo "     -F 'title=Test Hackathon 2026' \\"
echo "     -F 'description=A 24-hour coding challenge' \\"
echo "     -F 'category=Tech' \\"
echo "     -F 'capacity=100' \\"
echo "     -F 'price=250' \\"
echo "     -F 'date=2026-06-15' \\"
echo "     -F 'time=09:00' \\"
echo "     -F 'location=Computer Lab 3' \\"
echo "     -F 'status=draft' \\"
echo "     -F 'image=@/path/to/cover.jpg'"
echo ""
echo ""

# ─── 4. Verify drafts ────────────────────────────────────────
echo "4️⃣  List user's drafts (auth required)"
echo "───────────────────────────────────────────────"
echo "   curl -s '$BASE/api/events/drafts' \\"
echo "     -H 'Cookie: next-auth.session-token=<SESSION_TOKEN>'"
echo ""
echo ""

# ─── 5. Publish event ────────────────────────────────────────
echo "5️⃣  Publish an event"
echo "───────────────────────────────────────────────"
echo "   curl -s -X PUT '$BASE/api/events/<EVENT_ID>/publish' \\"
echo "     -H 'Cookie: next-auth.session-token=<SESSION_TOKEN>'"
echo ""
echo ""

# ─── 6. Main feed (public) ───────────────────────────────────
echo "6️⃣  Main event feed (published only)"
echo "───────────────────────────────────────────────"
curl -s "$BASE/api/events" | python -m json.tool 2>/dev/null || echo "(raw response above)"
echo ""
echo ""

# ─── 7. Featured events ──────────────────────────────────────
echo "7️⃣  Featured events"
echo "───────────────────────────────────────────────"
curl -s "$BASE/api/events?featured=true" | python -m json.tool 2>/dev/null || echo "(raw response above)"
echo ""
echo ""

# ─── 8. Upcoming events ──────────────────────────────────────
echo "8️⃣  Upcoming events"
echo "───────────────────────────────────────────────"
curl -s "$BASE/api/events?upcoming=true" | python -m json.tool 2>/dev/null || echo "(raw response above)"
echo ""
echo ""

echo "═══════════════════════════════════════════════"
echo "  ✅ Verification Checklist:"
echo "  □ User registered successfully"
echo "  □ Login works → JWT token captured"
echo "  □ Draft event created with ID returned"
echo "  □ Draft appears in /api/events/drafts"
echo "  □ Event published → full event returned"
echo "  □ Published event in /api/events feed"
echo "  □ Cover image URL accessible in browser"
echo "  □ All prices show ₹ (not \$)"
echo "═══════════════════════════════════════════════"
