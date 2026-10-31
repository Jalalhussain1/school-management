import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import apiRouter from './routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

const app = express();

// HTTP Request Logger
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching allowed origins
      if (!origin || config.corsOrigins.includes(origin) || config.nodeEnv === 'development') {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Not allowed by Access-Control-Allow-Origin'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to EduManage School Management System API Server',
    documentation: '/api/health',
    status: 'online',
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 EduManage School Management Backend Server running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🔍 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`🌱 Environment: ${config.nodeEnv}`);
  console.log(`=======================================================`);
});

// Graceful Shutdown
const handleGracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    console.log('Server terminated successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default app;
