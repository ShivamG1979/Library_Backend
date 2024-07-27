import Book from '../models/Book.js';

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: error.message });
    }
};

export const addBook = async (req, res) => {
    const { title, author, year, image } = req.body;
    if (!title || !author || !year || !image) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newBook = new Book({
            title,
            author,
            year,
            image,
            available: true,
            user: req.user.id,
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const result = await Book.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getBooksByUser = async (req, res) => {
    try {
        const books = await Book.find({ user: req.user.id });
        res.json(books);
    } catch (error) {
        console.error('Error fetching books by user:', error);
        res.status(500).json({ message: error.message });
    }
};

export const issueBook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!book.available) {
            return res.status(400).json({ message: 'Book is already issued' });
        }

        book.available = false;
        await book.save();

        res.status(200).json({ message: 'Book issued successfully' });
    } catch (error) {
        console.error('Error issuing book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
