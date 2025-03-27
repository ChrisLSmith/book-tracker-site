const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  owned: Boolean,
  read: Boolean,
  tbr: Boolean,
  pages: Number,
  wordCount: Number,
  publisher: String,
  startDate: Date,
  finishDate: Date,
  review: String
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
