# 🛍️ Product API — Buổi 7: Triển khai Backend Service

Demo backend service cho **Buổi 7** — Node.js + Express + MongoDB, sinh từ OpenAPI spec.

---

## 🗂️ Cấu trúc Project

```
product-api/
├── docs/
│   └── openapi.yaml          ← OpenAPI 3.0 spec (nguồn sự thật)
├── src/
│   ├── config/
│   │   ├── database.js        ← Kết nối MongoDB/Mongoose
│   │   └── seed.js            ← Dữ liệu mẫu
│   ├── models/
│   │   └── Product.js         ← Mongoose Schema + Model
│   ├── controllers/
│   │   └── productController.js ← Business logic (CRUD)
│   ├── routes/
│   │   └── productRoutes.js   ← Định nghĩa routes
│   ├── middlewares/
│   │   ├── validation.js      ← Input validation
│   │   └── errorHandler.js    ← Xử lý lỗi tập trung
│   └── server.js              ← Entry point
├── .env.example               ← Template biến môi trường
├── package.json
└── README.md
```

---

## ⚡ Cài đặt & Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Tạo file `.env`
```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/product_db
```

> **Nếu dùng MongoDB Atlas (cloud):**  
> `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/product_db`

### 3. Seed dữ liệu mẫu (tuỳ chọn)
```bash
npm run seed
```

### 4. Chạy server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server chạy tại: **http://localhost:3000**  
Swagger UI tại: **http://localhost:3000/api-docs**

---

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/products` | Lấy danh sách products |
| `POST` | `/api/v1/products` | Tạo product mới |
| `GET` | `/api/v1/products/:id` | Lấy product theo ID |
| `PUT` | `/api/v1/products/:id` | Cập nhật toàn bộ product |
| `PATCH` | `/api/v1/products/:id` | Cập nhật một phần product |
| `DELETE` | `/api/v1/products/:id` | Xóa product |

### Query Parameters (GET /products)

| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `page` | number | 1 | Trang hiện tại |
| `limit` | number | 10 | Số items/trang |
| `category` | string | — | Lọc theo category |
| `search` | string | — | Tìm kiếm theo tên/mô tả |
| `sortBy` | string | createdAt | Sắp xếp theo field |
| `sortOrder` | string | desc | `asc` hoặc `desc` |

---

## 🧪 Test với cURL

```bash
# Lấy tất cả products
curl http://localhost:3000/api/v1/products

# Tạo product mới
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro M4",
    "description": "Laptop Apple chip M4",
    "price": 52000000,
    "category": "Electronics",
    "stock": 10
  }'

# Lấy product theo ID (thay <id> bằng _id thực)
curl http://localhost:3000/api/v1/products/<id>

# Cập nhật toàn bộ (PUT)
curl -X PUT http://localhost:3000/api/v1/products/<id> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro M4 Updated",
    "price": 50000000,
    "category": "Electronics"
  }'

# Cập nhật một phần (PATCH)
curl -X PATCH http://localhost:3000/api/v1/products/<id> \
  -H "Content-Type: application/json" \
  -d '{ "price": 48000000 }'

# Xóa product
curl -X DELETE http://localhost:3000/api/v1/products/<id>

# Filter + Search
curl "http://localhost:3000/api/v1/products?category=Electronics&search=laptop&page=1&limit=5"
```

---

## 🏗️ Kiến trúc

```
Request → Routes → Validation Middleware → Controller → Model (Mongoose) → MongoDB
                                                    ↓
Response ←──────────────────────────── Controller ←─┘
                    ↑
            Error Handler Middleware
```

### Luồng dữ liệu

1. **OpenAPI Spec** (`openapi.yaml`) — Nguồn sự thật cho API contract
2. **Routes** — Map HTTP method + path → Controller function
3. **Validation Middleware** — Kiểm tra input trước khi vào controller
4. **Controller** — Business logic, gọi Model
5. **Model (Mongoose)** — Schema validation, tương tác MongoDB
6. **Error Handler** — Bắt và format lỗi thống nhất

---

## 📚 Các khái niệm học được (Buổi 7)

| Khái niệm | File | Mô tả |
|-----------|------|-------|
| OpenAPI Spec | `docs/openapi.yaml` | Định nghĩa API contract trước khi code |
| Mongoose Schema | `models/Product.js` | Map OpenAPI schema → MongoDB schema |
| CRUD Controller | `controllers/productController.js` | GET, POST, PUT, PATCH, DELETE |
| Input Validation | `middlewares/validation.js` | Validate request body/params/query |
| Error Handling | `middlewares/errorHandler.js` | Xử lý lỗi tập trung |
| Pagination | `controllers/productController.js` | Skip + Limit pattern |
| Database Index | `models/Product.js` | Tối ưu query performance |
