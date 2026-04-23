const { body, param, query, validationResult } = require('express-validator');

// ============================
// HELPER: Xử lý kết quả validation
// ============================
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((e) => `${e.path}: ${e.msg}`),
    });
  }
  next();
};

// ============================
// VALIDATE: MongoDB ObjectId
// ============================
const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid product ID format'),
  handleValidationErrors,
];

// ============================
// VALIDATE: Tạo product mới (POST)
// ============================
const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('imageUrl')
    .optional()
    .isURL().withMessage('imageUrl must be a valid URL'),

  handleValidationErrors,
];

// ============================
// VALIDATE: Cập nhật toàn bộ product (PUT)
// ============================
const validateUpdateProduct = [
  param('id').isMongoId().withMessage('Invalid product ID format'),

  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }),

  body('stock')
    .optional()
    .isInt({ min: 0 }),

  body('imageUrl')
    .optional()
    .isURL(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),

  handleValidationErrors,
];

// ============================
// VALIDATE: Cập nhật một phần (PATCH)
// ============================
const validatePatchProduct = [
  param('id').isMongoId().withMessage('Invalid product ID format'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }),

  body('price')
    .optional()
    .isFloat({ min: 0 }),

  body('category')
    .optional()
    .trim()
    .notEmpty(),

  body('stock')
    .optional()
    .isInt({ min: 0 }),

  body('imageUrl')
    .optional()
    .isURL(),

  body('isActive')
    .optional()
    .isBoolean(),

  handleValidationErrors,
];

// ============================
// VALIDATE: Query params cho GET /products
// ============================
const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'createdAt']).withMessage('sortBy must be: name, price, or createdAt'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc']).withMessage('sortOrder must be: asc or desc'),

  handleValidationErrors,
];

module.exports = {
  validateObjectId,
  validateCreateProduct,
  validateUpdateProduct,
  validatePatchProduct,
  validateProductQuery,
};
