# Bài tập thực hành: Thiết kế API và Phân tích mã lỗi HTTP

Dự án này là một mock API đơn giản được xây dựng bằng **FastAPI** (không cần database) để thực hành việc thiết kế HTTP request và phân tích các mã lỗi phổ biến.

## 1. Thiết kế 5 tình huống HTTP Request cơ bản

Dưới đây là 5 tình huống phổ biến (CRUD) được sử dụng để tương tác với tài nguyên `Users`:

| Tình huống | Method | URL (Endpoint) | Mô tả | Mã thành công |
| :--- | :---: | :--- | :--- | :---: |
| **1. Lấy danh sách** | `GET` | `/users` | Truy xuất và trả về danh sách toàn bộ người dùng. | `200 OK` |
| **2. Xem chi tiết** | `GET` | `/users/{id}` | Lấy thông tin chi tiết của 1 người dùng theo ID. | `200 OK` |
| **3. Tạo mới** | `POST` | `/users` | Gửi dữ liệu (name, email) lên để server tạo user mới. | `201 Created` |
| **4. Cập nhật email** | `PATCH` | `/users/{id}/email` | Cập nhật một phần dữ liệu (chỉ email) của user cụ thể. | `200 OK` |
| **5. Xóa user** | `DELETE`| `/users/{id}` | Xóa một user khỏi hệ thống. | `200 OK` |

---

## 2. Phân tích các mã lỗi HTTP thường gặp (404, 500, 429...)

Mã trạng thái HTTP (HTTP Status Code) được chia làm 5 nhóm chính, trong đó các lỗi thường rơi vào nhóm **4xx (Lỗi do Client)** và **5xx (Lỗi do Server)**.

### 🔴 Mã lỗi 404 - Not Found (Không tìm thấy)
- **Ý nghĩa:** Server đang hoạt động bình thường, nhưng không tìm thấy tài nguyên mà Client yêu cầu.
- **Tình huống thực tế:** 
  - Người dùng truy cập vào một đường link URL bị gõ sai.
  - Gọi API `GET /users/99` để lấy thông tin của user mang ID 99, nhưng trong cơ sở dữ liệu hệ thống chỉ có ID đến 50.
- **Cách xử lý:** Phía client cần kiểm tra lại đường dẫn URL hoặc ID dữ liệu gửi đi. Phía Server nên trả về JSON với thông báo lỗi rõ ràng.

### 🔴 Mã lỗi 429 - Too Many Requests (Quá nhiều yêu cầu)
- **Ý nghĩa:** Client đang gửi một lượng lớn request vượt mức cho phép trong một khoảng thời gian ngắn.
- **Tình huống thực tế:**
  - Hệ thống sử dụng cơ chế **Rate Limiting** (giới hạn lượt gọi API) để chống các cuộc tấn công DDoS hoặc spam (Ví dụ: Server quy định chỉ được gọi API lấy mã OTP tối đa 3 lần / 1 phút. Cố tình gọi lần thứ 4 sẽ dính lỗi 429).
- **Cách xử lý:** Server thường sẽ đính kèm một HTTP header có tên là `Retry-After` để báo cho Client biết thời gian tính bằng giây cần phải chờ trước khi thực hiện request tiếp theo.

### 🔴 Mã lỗi 500 - Internal Server Error (Lỗi máy chủ nội bộ)
- **Ý nghĩa:** Đây là một lỗi chung chung (Generic Error) báo hiệu rằng server đã gặp phải một tình trạng bất ngờ và không thể hoàn thành request.
- **Tình huống thực tế:**
  - Lỗi xảy ra do đoạn code Backend xử lý sai logic (VD: chia cho 0, gọi đến một biến chưa được khai báo hoặc hàm bị lỗi).
  - Server bị mất kết nối đột ngột với Database.
- **Cách xử lý:** Phía Client không thể tự sửa được, chỉ có thể thông báo "Lỗi hệ thống, vui lòng thử lại sau". Developer ở Backend cần phải theo dõi (monitor) Log hệ thống, tìm ra dòng code gây lỗi để thực hiện vá lỗi (Fix Bug).

### 💡 Các mã lỗi khác thường gặp:
- **400 Bad Request:** Client gửi dữ liệu sai cấu trúc hoặc thiếu các trường bắt buộc (VD: API bắt buộc điền `email` nhưng lại bỏ trống).
- **401 Unauthorized:** Yêu cầu truy cập bị từ chối do Client chưa đăng nhập (thiếu mã Access Token).
- **403 Forbidden:** Client đã đăng nhập (Xác thực) nhưng không có đủ quyền hạn (Phân quyền) để thực hiện hành động này (VD: Nhân viên thường cố gắng truy cập API xóa lịch sử tài khoản của Giám đốc).