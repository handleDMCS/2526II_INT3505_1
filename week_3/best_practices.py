from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel

# Khởi tạo app
app = FastAPI(
    title="API Design Best Practices Demo",
    description="Demo ứng dụng các nguyên tắc: Naming conventions, Versioning, Plural nouns, Hyphens.",
    version="1.0.0"
)

# =====================================================================
# BEST PRACTICE 1: VERSIONING (Đánh phiên bản cho API)
# =====================================================================
# Tạo một router riêng cho phiên bản v1 (để sau này dễ mở rộng lên v2)
v1_router = APIRouter(prefix="/api/v1")


# Mock data để demo
fake_users = {
    1: {"name": "Nguyen Van A", "email": "a@gmail.com"},
    2: {"name": "Tran Thi B", "email": "b@gmail.com"}
}
fake_orders = {
    101: {"user_id": 1, "item": "Laptop", "total": 1500},
    102: {"user_id": 1, "item": "Mouse", "total": 50}
}

class UserCreate(BaseModel):
    name: str
    email: str

# =====================================================================
# BEST PRACTICE 2 & 3: PLURAL NOUNS (Danh từ số nhiều) & NO VERBS
# Không dùng: /getUser, /createUser
# Dùng: /users kết hợp với các HTTP Methods (GET, POST)
# =====================================================================

@v1_router.get("/users", tags=["Users"])
async def get_all_users():
    """Lấy danh sách tất cả người dùng."""
    return {"data": fake_users}


@v1_router.post("/users", tags=["Users"], status_code=201)
async def create_user(user: UserCreate):
    """
    Thêm người dùng mới. 
    Hành động 'Create' được thể hiện qua method POST, không đặt trong URL.
    """
    new_id = len(fake_users) + 1
    fake_users[new_id] = user.dict()
    return {"message": "User created successfully", "data": fake_users[new_id]}


# =====================================================================
# BEST PRACTICE 4: CLARITY & NESTED RESOURCES (Dễ hiểu & Phân cấp rõ ràng)
# Ví dụ trong slide: /users, /orders/{id}
# Mối quan hệ: Lấy danh sách đơn hàng CỦA một người dùng cụ thể
# =====================================================================

@v1_router.get("/users/{user_id}/orders", tags=["Users & Orders"])
async def get_user_orders(user_id: int):
    """Lấy danh sách đơn hàng của một user cụ thể."""
    if user_id not in fake_users:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_orders = {k: v for k, v in fake_orders.items() if v["user_id"] == user_id}
    return {"user_id": user_id, "orders": user_orders}


# =====================================================================
# BEST PRACTICE 5: LOWERCASE & HYPHENS (Chữ thường & Dấu gạch ngang)
# Không dùng: /ProductCategories, /product_categories
# Dùng: /product-categories
# =====================================================================

@v1_router.get("/product-categories", tags=["Products"])
async def get_product_categories():
    """Danh mục sản phẩm (Ví dụ về dùng dấu gạch ngang hyphens)."""
    categories =[
        {"id": 1, "slug": "electronics", "name": "Đồ điện tử"},
        {"id": 2, "slug": "home-appliances", "name": "Đồ gia dụng"}
    ]
    return {"data": categories}


# Gắn v1_router vào app chính
app.include_router(v1_router)