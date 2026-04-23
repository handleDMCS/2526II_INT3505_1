const Product = require('../models/Product');

// ============================
// GET /products - Lấy danh sách products (có phân trang, filter, sort)
// ============================
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = { $regex: category, $options: 'i' }; // case-insensitive
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute queries in parallel for performance
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================
// GET /products/:id - Lấy một product theo ID
// ============================
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ============================
// POST /products - Tạo product mới
// ============================
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    const savedProduct = await product.save();

    console.log(`✅ Product created: ${savedProduct._id} - ${savedProduct.name}`);

    res.status(201).json({
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ============================
// PUT /products/:id - Cập nhật toàn bộ product
// ============================
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, imageUrl, isActive } = req.body;

    // findByIdAndUpdate với { new: true } để trả về document sau khi update
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, imageUrl, isActive },
      {
        new: true,           // Trả về document mới sau update
        runValidators: true, // Chạy schema validators
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    console.log(`✏️  Product updated: ${product._id}`);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ============================
// PATCH /products/:id - Cập nhật một phần product
// ============================
const patchProduct = async (req, res, next) => {
  try {
    // Chỉ lấy các fields được gửi lên (bỏ undefined)
    const updates = {};
    const allowedFields = ['name', 'description', 'price', 'category', 'stock', 'imageUrl', 'isActive'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates }, // Chỉ update các fields được chỉ định
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    console.log(`🔧 Product patched: ${product._id} - Fields: ${Object.keys(updates).join(', ')}`);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ============================
// DELETE /products/:id - Xóa product
// ============================
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    console.log(`🗑️  Product deleted: ${product._id} - ${product.name}`);

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
