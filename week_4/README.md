Based on the image provided, here is a professional **README.md** template you can use for your project. I have written it in English with Vietnamese descriptions to match your API.

---

# Books Management API

A simple RESTful API for managing a collection of books. This API is hosted/mocked on **Beeceptor** and provides full CRUD (Create, Read, Update, Delete) functionality.

## 🚀 Base URL
```text
https://oas574183232d3e.free.beeceptor.com
```
*(Note: Replace this with your actual Beeceptor endpoint if different)*

## 📚 API Endpoints

### 1. Get All Books
Returns a list of all books in the database.
*   **Method:** `GET`
*   **Path:** `/books`
*   **Description:** Lấy danh sách tất cả các cuốn sách.

### 2. Create a New Book
Adds a new book record.
*   **Method:** `POST`
*   **Path:** `/books`
*   **Description:** Thêm một cuốn sách mới.
*   **Body (JSON Example):**
    ```json
    {
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "year": 2008
    }
    ```

### 3. Get Book Details
Fetch specific information about a single book using its ID.
*   **Method:** `GET`
*   **Path:** `/books/{bookId}`
*   **Description:** Lấy thông tin chi tiết một cuốn sách theo ID.

### 4. Update Book
Update the information of an existing book.
*   **Method:** `PUT`
*   **Path:** `/books/{bookId}`
*   **Description:** Cập nhật thông tin sách.
*   **Body (JSON Example):**
    ```json
    {
      "title": "Clean Code (Updated)",
      "author": "Robert C. Martin"
    }
    ```

### 5. Delete Book
Remove a book from the collection.
*   **Method:** `DELETE`
*   **Path:** `/books/{bookId}`
*   **Description:** Xóa một cuốn sách.

---

## 🛠 Usage Example (cURL)

To get all books, run the following command in your terminal:

```bash
curl -X GET https://oas574183232d3e.free.beeceptor.com/books
```

## ⚙️ Built With
*   **Beeceptor** - For API Mocking and Request Inspection.
*   **OpenAPI/Swagger** - For API Documentation.

---

### Tips for Customization:
1.  **Base URL:** Make sure to use the exact URL shown in your Beeceptor console.
2.  **Data Structure:** If you have specific fields (like `ISBN`, `price`, etc.), add them to the JSON examples above.
3.  **Authentication:** If you add a token or API key later, remember to document the headers.