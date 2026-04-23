const mongoose = require('mongoose');

// ============================
// PRODUCT SCHEMA (tương ứng với OpenAPI spec)
// ============================
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Stock must be an integer',
      },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    versionKey: false, // Bỏ field __v
  }
);

// ============================
// INDEXES - Tối ưu query performance
// ============================
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ category: 1 });                        // Filter by category
productSchema.index({ price: 1 });                           // Sort by price
productSchema.index({ createdAt: -1 });                      // Sort by newest

// ============================
// INSTANCE METHODS
// ============================
productSchema.methods.toJSON = function () {
  const product = this.toObject();
  return product;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
