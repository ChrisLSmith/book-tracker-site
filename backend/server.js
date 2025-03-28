const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON request bodies

// Mongoose model
const Book = require('./models/Book');

// Root route for sanity check
app.get('/', (req, res) => {
  res.send('📚 Book Tracker Backend is Running');
});

// POST: Create a new book
app.post('/api/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Retrieve all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a book by ID
app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete a book by ID
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get a book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// MongoDB connection
console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI); // optional debug line

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});