require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// ============================
// KHỞI TẠO APP
// ============================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// KẾT NỐI DATABASE
// ============================
connectDB();

// ============================
// MIDDLEWARES
// ============================

// Bảo mật HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Tắt để Swagger UI hoạt động
}));

// CORS - Cho phép frontend gọi API
app.use(cors({
  origin: '*', // Trong production, chỉ định domain cụ thể
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan('dev'));

// ============================
// SWAGGER UI - API DOCUMENTATION
// Load từ file openapi.yaml
// ============================
try {
  const openApiPath = path.join(__dirname, '../docs/openapi.yaml');
  const swaggerDocument = yaml.load(fs.readFileSync(openApiPath, 'utf8'));

  // Cập nhật server URL từ environment
  if (swaggerDocument.servers) {
    swaggerDocument.servers[0].url = `${process.env.API_BASE_URL || 'http://localhost:' + PORT}/api/v1`;
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'Product API Docs',
    customCss: `
      .topbar { background-color: #1a1a2e; }
      .topbar-wrapper img { display: none; }
      .topbar-wrapper::after { content: "🛍️ Product API"; color: white; font-size: 1.2em; font-weight: bold; }
    `,
  }));
  console.log('📚 Swagger UI loaded from openapi.yaml');
} catch (err) {
  console.warn('⚠️  Could not load Swagger UI:', err.message);
}

// ============================
// ROUTES
// ============================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API v1 routes
app.use('/api/v1/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🛍️ Product API - Buổi 7 Demo',
    version: '1.0.0',
    docs: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      health: 'GET /health',
      products: {
        list: 'GET /api/v1/products',
        create: 'POST /api/v1/products',
        detail: 'GET /api/v1/products/:id',
        update: 'PUT /api/v1/products/:id',
        patch: 'PATCH /api/v1/products/:id',
        delete: 'DELETE /api/v1/products/:id',
      },
    },
  });
});

// ============================
// ERROR HANDLERS (phải đặt SAU routes)
// ============================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`🛍️  Product API Server started!`);
  console.log(`📡 URL:     http://localhost:${PORT}`);
  console.log(`📚 Docs:    http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health:  http://localhost:${PORT}/health`);
  console.log('🚀 ================================\n');
});

module.exports = app;
