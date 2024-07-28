//controllers/adminController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js'; // Add this import
import Book from '../models/Book.js'; // Add this import

// Register Admin
export const registerAdmin = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new admin
        const newAdmin = new Admin({
            email,
            password: hashedPassword,
            username
        });

        // Save admin to the database
        await newAdmin.save();

        // Generate a token (optional)
        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Admin registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login Admin
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Admin Profile Handler
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ user: { username: admin.username, email: admin.email } });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Admin Profile Handler
export const updateAdminProfile = async (req, res) => {
    const { username, email, password, newPassword } = req.body;

    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (username) admin.username = username;
        if (email) admin.email = email;

        if (password && newPassword) {
            // Check if current password is correct
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);
            admin.password = hashedNewPassword;
        }

        await admin.save();
        res.json({ message: 'Profile updated successfully', admin });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get All Users Handler
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Books Handler
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Book Handler
export const deleteBook = async (req, res) => {
    try {
        const result = await Book.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Issue Book Handler
export const issueBook = async (req, res) => {
    try {
        const { userId } = req.body; // Assuming userId is passed in the request body
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!book.available) {
            return res.status(400).json({ message: 'Book is already issued' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        book.available = false;
        book.issuedTo = userId; // Assuming Book schema has an issuedTo field
        await book.save();

        res.status(200).json({ message: 'Book issued successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Update Book Handler
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete User Handler
export const deleteUser = async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update User Handler
export const updateUser = async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add User Handler
export const addUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const addBook = async (req, res) => {
    const { title, author, year, image, available } = req.body;
    const userId = req.user.id; // Assuming req.user.id contains the ID of the currently logged-in user

    if (!title || !author || !year || !image) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newBook = new Book({
            title,
            author,
            year,
            image,
            available: available !== undefined ? available : true,
            user: userId // Assign the user who added the book
        });

        await newBook.save();

        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};