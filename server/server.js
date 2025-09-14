import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import surgeryRoutes from './routes/surgeries.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'surgery-manager';
const MONGODB_URI = `mongodb://localhost:${MONGO_PORT}/${DATABASE_NAME}`;

// Middleware
app.use(cors());
app.use(express.json());

//Basic Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/surgeries', surgeryRoutes);

// DB Connection
await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});