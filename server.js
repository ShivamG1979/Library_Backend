import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // Import admin routes  
import cors from 'cors'; 

dotenv.config();  

connectDB();

const app = express();
app.use(express.json()); 
app.use(cors()); 

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/auth/admin', adminRoutes);
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
