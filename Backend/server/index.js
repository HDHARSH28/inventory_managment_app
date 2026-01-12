import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.js';
import historyRoutes from './routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch((error) => console.error('MongoDB connection error:', error));

let isConnected = false;
async function connectTOMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

app.use((req, res, next) => {
  if (!isConnected) {
    connectTOMongoDB().then(() => next());
  } else {
    next();
  }
});

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/history', historyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;