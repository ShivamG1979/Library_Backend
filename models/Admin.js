import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true } // Admins should have isAdmin set to true by default
});

export default mongoose.model('Admin', AdminSchema);
