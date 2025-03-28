import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

config();

const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://sand-01-kqjq.onrender.com',
  'https://sand-pbmk.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Import routes using ES modules
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import promoterRouter from './routes/promoter.routes.js';
import misRouter from './routes/mis.routes.js';
import managerRouter from './routes/manager.routes.js';

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/promoter", promoterRouter);
app.use("/api/v1/mis", misRouter);
app.use("/api/v1/manager", managerRouter);

export default app;