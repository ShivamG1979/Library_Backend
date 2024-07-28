//models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({ 
    title: { type: String, required: true },
    author: { type: String, required: true }, 
    year: { type: Number, required: true }, 
    image: { type: String, required: true },
    available: { type: Boolean, default: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added user field
});

bookSchema.index({ title: 1, author: 1 });

const Book = mongoose.model('Book', bookSchema);
export default Book;
