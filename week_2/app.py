from fastapi import FastAPI, HTTPException, Request, status
from pydantic import BaseModel
import time

app = FastAPI(
    title="Thực hành API",
    description="Mock API thiết kế 5 tình huống HTTP request và mô phỏng lỗi"
)

# Database "giả" lưu trên RAM
mock_db = {
    1: {"id": 1, "name": "Nguyen Van A", "email": "a@example.com"},
    2: {"id": 2, "name": "Tran Thi B", "email": "b@example.com"}
}

class UserCreate(BaseModel):
    name: str
    email: str

class UserEmailUpdate(BaseModel):
    email: str

# --- 5 TÌNH HUỐNG HTTP REQUEST ---

# 1. Lấy danh sách người dùng (GET)
@app.get("/users", status_code=status.HTTP_200_OK, tags=["Scenarios"])
def get_users():
    return list(mock_db.values())

# 2. Lấy thông tin 1 người dùng cụ thể (GET) - Có thể sinh lỗi 404
@app.get("/users/{user_id}", status_code=status.HTTP_200_OK, tags=["Scenarios"])
def get_user(user_id: int):
    if user_id not in mock_db:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng (User not found)")
    return mock_db[user_id]

# 3. Tạo người dùng mới (POST) - Sinh mã 201 Created
@app.post("/users", status_code=status.HTTP_201_CREATED, tags=["Scenarios"])
def create_user(user: UserCreate):
    new_id = max(mock_db.keys()) + 1 if mock_db else 1
    new_user = {"id": new_id, "name": user.name, "email": user.email}
    mock_db[new_id] = new_user
    return new_user

# 4. Cập nhật email người dùng (PATCH)
@app.patch("/users/{user_id}/email", status_code=status.HTTP_200_OK, tags=["Scenarios"])
def update_email(user_id: int, user_update: UserEmailUpdate):
    if user_id not in mock_db:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    mock_db[user_id]["email"] = user_update.email
    return mock_db[user_id]

# 5. Xóa người dùng (DELETE)
@app.delete("/users/{user_id}", status_code=status.HTTP_200_OK, tags=["Scenarios"])
def delete_user(user_id: int):
    if user_id not in mock_db:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    deleted_user = mock_db.pop(user_id)
    return {"message": "Đã xóa thành công", "user": deleted_user}


@app.get("/simulate-error/500", tags=["Error Simulations"])
def simulate_server_error():
    # Cố tình gây lỗi chia cho 0 để server crash
    error_trigger = 1 / 0 
    return {"message": "Dòng code này sẽ không bao giờ chạy tới"}

# Mô phỏng lỗi 429 Too Many Requests (Rate limit)
request_history = []

@app.get("/simulate-error/429", tags=["Error Simulations"])
def simulate_rate_limit():
    global request_history
    current_time = time.time()
    
    request_history =[t for t in request_history if current_time - t < 10]
    if len(request_history) >= 3:
        raise HTTPException(status_code=429, detail="Bạn đã gửi quá nhiều request. Vui lòng chờ vài giây (Too Many Requests).")
    
    request_history.append(current_time)
    return {"message": "Thành công! Bạn chưa bị chặn."}

# uv run uvicorn week_2.app:app --reload
# Sau đó truy cập: http://localhost:8000/docs để mở giao diện Swagger UI và test API.