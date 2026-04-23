from fastapi import APIRouter, HTTPException, status
from jose import JWTError
from pydantic import BaseModel

from config import create_access_token, create_refresh_token, decode_token
from database import create_user, get_user, verify_password

router = APIRouter()


class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str = "user"  # "user" or "admin"


class LoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/register", status_code=201)
def register(body: RegisterRequest):
    if get_user(body.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    create_user(body.username, body.password, body.role)
    return {"message": f"User '{body.username}' created"}


@router.post("/login")
def login(body: LoginRequest):
    user = get_user(body.username)
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {"sub": user["username"], "role": user["role"]}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
    }


@router.post("/refresh")
def refresh(body: RefreshRequest):
    exc = HTTPException(status_code=401, detail="Invalid refresh token")
    try:
        payload = decode_token(body.refresh_token)
        if payload.get("type") != "refresh":
            raise exc
        username = payload.get("sub")
    except JWTError:
        raise exc

    user = get_user(username)
    if not user:
        raise exc

    token_data = {"sub": user["username"], "role": user["role"]}
    return {
        "access_token": create_access_token(token_data),
        "token_type": "bearer",
    }
