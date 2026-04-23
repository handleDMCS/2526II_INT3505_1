from fastapi import APIRouter, Depends

from middleware.auth import get_current_user, require_role

router = APIRouter()


@router.get("/profile")
def profile(current_user: dict = Depends(get_current_user)):
    """Any authenticated user can access this."""
    return {
        "username": current_user["username"],
        "role": current_user["role"],
    }


@router.get("/admin")
def admin_panel(current_user: dict = Depends(require_role("admin"))):
    """Admin-only endpoint — returns 403 for regular users."""
    return {"message": f"Welcome, admin {current_user['username']}!"}
