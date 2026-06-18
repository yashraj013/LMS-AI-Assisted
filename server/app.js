import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/db.js';
import authRoute from './src/routes/authRoute.js';
import lessonRoute from './src/routes/lessonRoute.js';
import moduleRoute from './src/routes/moduleRoute.js';
import progressRoute from './src/routes/progressRoute.js';
import assistantRoute from './src/routes/assistantRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
  });
});

app.use('/api/auth', authRoute);
app.use('/api/modules', moduleRoute);
app.use('/api/lessons', lessonRoute);
app.use('/api/progress', progressRoute);
app.use('/api/assistant', assistantRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' },
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: { message: err.message || 'Internal server error' },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;