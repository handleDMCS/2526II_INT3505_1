require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const connectDB = require('./database');

const sampleProducts = [
  {
    name: 'Laptop Dell XPS 15',
    description: 'Laptop cao cấp với màn hình OLED 15.6 inch, Intel Core i9, RAM 32GB',
    price: 45000000,
    category: 'Electronics',
    stock: 25,
    imageUrl: 'https://picsum.photos/seed/laptop1/400/300',
    isActive: true,
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Flagship smartphone của Apple, chip A17 Pro, camera 48MP',
    price: 34990000,
    category: 'Electronics',
    stock: 50,
    imageUrl: 'https://picsum.photos/seed/phone1/400/300',
    isActive: true,
  },
  {
    name: 'Tai nghe Sony WH-1000XM5',
    description: 'Tai nghe chống ồn chủ động hàng đầu thế giới, pin 30 giờ',
    price: 8500000,
    category: 'Electronics',
    stock: 100,
    imageUrl: 'https://picsum.photos/seed/headphone1/400/300',
    isActive: true,
  },
  {
    name: 'Bàn phím cơ Keychron K2',
    description: 'Bàn phím cơ compact 75%, switch Gateron Brown, đèn RGB',
    price: 2200000,
    category: 'Accessories',
    stock: 75,
    imageUrl: 'https://picsum.photos/seed/keyboard1/400/300',
    isActive: true,
  },
  {
    name: 'Màn hình LG UltraWide 34"',
    description: 'Màn hình ultrawide 34 inch, độ phân giải 3440x1440, 144Hz',
    price: 18500000,
    category: 'Electronics',
    stock: 15,
    imageUrl: 'https://picsum.photos/seed/monitor1/400/300',
    isActive: true,
  },
  {
    name: 'Chuột Logitech MX Master 3',
    description: 'Chuột không dây cao cấp, cuộn MagSpeed, pin 70 ngày',
    price: 2800000,
    category: 'Accessories',
    stock: 60,
    imageUrl: 'https://picsum.photos/seed/mouse1/400/300',
    isActive: true,
  },
  {
    name: 'iPad Pro M4 12.9"',
    description: 'Tablet mạnh mẽ nhất của Apple, chip M4, màn hình Liquid Retina XDR',
    price: 28990000,
    category: 'Electronics',
    stock: 30,
    imageUrl: 'https://picsum.photos/seed/ipad1/400/300',
    isActive: true,
  },
  {
    name: 'Ghế công thái học ErgoChair Pro',
    description: 'Ghế văn phòng cao cấp, điều chỉnh lumbar, ngồi 8 tiếng không mỏi',
    price: 9500000,
    category: 'Furniture',
    stock: 20,
    imageUrl: 'https://picsum.photos/seed/chair1/400/300',
    isActive: false, // demo isActive = false
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Xóa data cũ
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Thêm data mẫu
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`🌱 Seeded ${inserted.length} products successfully`);

    // Hiển thị summary
    console.log('\n📋 Sample products:');
    inserted.forEach((p, i) => {
      console.log(`  ${i + 1}. [${p._id}] ${p.name} - ${p.price.toLocaleString('vi-VN')}đ`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDB();
