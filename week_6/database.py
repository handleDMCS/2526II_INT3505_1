from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Simple in-memory store — swap for a real DB in production
fake_users_db: dict[str, dict] = {}


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def get_user(username: str) -> dict | None:
    return fake_users_db.get(username)


def create_user(username: str, password: str, role: str = "user") -> dict:
    user = {
        "username": username,
        "hashed_password": hash_password(password),
        "role": role,
    }
    fake_users_db[username] = user
    return user
