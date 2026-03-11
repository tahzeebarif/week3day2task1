require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const swaggerSpec = require('./docs/swagger');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── Swagger UI ───────────────────────────────────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { background-color: #1a1a2e; }
      .swagger-ui .topbar-wrapper .link span { display: none; }
      .swagger-ui .topbar-wrapper::after { content: 'Task Manager API v2'; color: white; font-size: 1.2rem; font-weight: bold; }
    `,
    customSiteTitle: 'Task Manager API Docs',
  })
);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Manager API is running 🚀',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    docs: '/api/docs',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/users', authRoutes);
app.use('/api/tasks', taskRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format.',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ─── Start Server (Local only) ────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════╗');
    console.log(`║  Task Manager API v2               ║`);
    console.log(`║  Server: http://localhost:${PORT}     ║`);
    console.log(`║  Docs:   http://localhost:${PORT}/api/docs ║`);
    console.log('╚════════════════════════════════════╝\n');
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
}

// ─── Export for Vercel ────────────────────────────────────────────────────────
module.exports = app;