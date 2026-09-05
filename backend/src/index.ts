import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profilesRouter from './routes/profiles';
import documentsRouter from './routes/documents';
import accountsRouter from './routes/accounts';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware: allow multiple origins (comma-separated) for dev + production
const corsOrigin = process.env.CORS_ORIGIN;
const allowedOrigins = corsOrigin
  ? corsOrigin.split(',').map((o) => o.trim()).filter(Boolean)
  : ['*'];
app.use(cors({
  origin: allowedOrigins.length === 1 && allowedOrigins[0] === '*' ? true : allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (v1 prefix for future ML and versioning)
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/documents', documentsRouter);
app.use('/api/v1/accounts', accountsRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
