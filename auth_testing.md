# Auth Testing Playbook — Setia Digital Creative

Scope: single-admin JWT auth (no registration, no password reset), adapted from the Custom Email/Password JWT Authentication Playbook.

- Backend: FastAPI on :8001, routes under /api
- Password hashing: bcrypt (users.password_hash starts with $2b$)
- Tokens: PyJWT HS256 — access 30 min + refresh 7 days, set as httpOnly cookies (secure, samesite=none); Bearer header fallback for access token
- Login brute force: login_attempts collection keyed "{ip}:{email}"; 5 fails = 15 min lockout; cleared on success
- Admin seeding: startup event, only creates admin if missing (never reverts a changed password)
- Indexes: users.email unique, login_attempts.identifier

Endpoints:
- POST /api/auth/login {email, password} → sets cookies, returns {user}
- POST /api/auth/refresh → rotates cookies
- GET /api/auth/me → admin object (cookie or Bearer)
- POST /api/auth/logout → clears cookies
- GET /api/admin/inquiries (auth) → list contact inquiries
- DELETE /api/admin/inquiries/{id} (auth) → delete inquiry
- Demo (public): POST/GET /api/demo/{theme_id}/rsvp, POST/GET /api/demo/{theme_id}/wishes

Test steps:
1. mongosh: db.users.find({role:"admin"}) — hash starts with $2b$
2. curl -c cookies.txt -X POST {API_URL}/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@setiadigital.id","password":"<ADMIN_PASSWORD>"}'
3. curl -b cookies.txt {API_URL}/api/auth/me → returns admin
4. curl -b cookies.txt {API_URL}/api/admin/inquiries → JSON array
5. Wrong password 5x → 429 locked for 15 min (test on a throwaway email to avoid locking the real admin)
