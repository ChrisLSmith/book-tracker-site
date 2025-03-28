require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Book } = require('./models');

const app = express();

app.use(cors());

const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(session({
  secret: 'super-secret-key', // Replace this with a secure secret in production
  resave: false,
  saveUninitialized: false
}));

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

app.use(express.json());

function requireLogin(req, res, next) {
  if (req.session.user !== ADMIN_USERNAME) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}

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

app.post('/api/books', requireLogin, async (req, res) => {
  const book = await Book.create(req.body);
  res.json(book);
});

app.put('/api/books/:id', requireLogin, async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  await book.update(req.body);
  res.json(book);
});

app.delete('/api/books/:id', requireLogin, async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  await book.destroy();
  res.json({ message: 'Book deleted' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    req.session.user = username;
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});