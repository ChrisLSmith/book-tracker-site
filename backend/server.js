require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Book } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// Sync database
sequelize.sync().then(() => {
  console.log('✅ SQLite DB synced');
}).catch(err => {
  console.error('❌ DB sync error:', err);
});


const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.get('/api/books', async (req, res) => {
  const books = await Book.findAll({ order: [['title', 'ASC']] });
  res.json(books);
});

app.get('/api/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  book ? res.json(book) : res.status(404).json({ error: 'Book not found' });
});

app.post('/api/books', async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
});

app.put('/api/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  await book.update(req.body);
  res.json(book);
});

app.delete('/api/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  await book.destroy();
  res.json({ message: 'Book deleted' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});