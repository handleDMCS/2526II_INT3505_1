const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} = require('../controllers/productController');

const {
  validateObjectId,
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchProduct,
  validateProductQuery,
} = require('../middlewares/validation');

// ============================
// PRODUCT ROUTES
// Prefix: /api/v1/products
// ============================

// GET    /api/v1/products       → Lấy tất cả products (có filter/sort/pagination)
// POST   /api/v1/products       → Tạo product mới
router
  .route('/')
  .get(validateProductQuery, getProducts)
  .post(validateCreateProduct, createProduct);

// GET    /api/v1/products/:id   → Lấy product theo ID
// PUT    /api/v1/products/:id   → Cập nhật toàn bộ product
// PATCH  /api/v1/products/:id   → Cập nhật một phần product
// DELETE /api/v1/products/:id   → Xóa product
router
  .route('/:id')
  .get(validateObjectId, getProductById)
  .put(validateUpdateProduct, updateProduct)
  .patch(validatePatchProduct, patchProduct)
  .delete(validateObjectId, deleteProduct);

module.exports = router;
