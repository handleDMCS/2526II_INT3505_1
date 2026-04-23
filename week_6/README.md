# JWT Auth Demo — Buổi 6

A minimal FastAPI app demonstrating JWT authentication and authorization.

## Setup

```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-dotenv
cp .env.example .env
uvicorn main:app --reload
```

Then open http://localhost:8000/docs for the interactive API explorer.

## Flow

```
POST /auth/register   → create a user (role: "user" or "admin")
POST /auth/login      → get access_token + refresh_token
GET  /api/profile     → bearer token required
GET  /api/admin       → admin role required
POST /auth/refresh    → swap refresh_token for a new access_token
```

## Key Concepts Covered

| Concept | Where |
|---|---|
| JWT signing / verification | `config.py` |
| Bearer token extraction | `middleware/auth.py` |
| Access token (15 min) | `config.py` → `create_access_token` |
| Refresh token (7 days) | `config.py` → `create_refresh_token` |
| Scopes / roles | `middleware/auth.py` → `require_role()` |
| Password hashing (bcrypt) | `database.py` |

## Security Notes (audit checklist)

- [ ] Rotate `SECRET_KEY` — never commit it to git
- [ ] Use HTTPS in production to prevent token leakage in transit
- [ ] Store refresh tokens server-side to support revocation (replay attack mitigation)
- [ ] Set `secure` + `httpOnly` flags if storing tokens in cookies
- [ ] Replace the in-memory `fake_users_db` with a real database
