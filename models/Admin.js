//models/Admin.js

import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true } // Ensure this field is defined
});

export default mongoose.model('Admin', AdminSchema);
