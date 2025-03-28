const { Sequelize, DataTypes } = require('sequelize');

// Initialize SQLite DB
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'books.sqlite' // creates a local file-based DB
});

// Define Book model
const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: DataTypes.STRING,
  owned: DataTypes.BOOLEAN,
  read: DataTypes.BOOLEAN,
  tbr: DataTypes.BOOLEAN,
  review: DataTypes.TEXT,
  wordCount: DataTypes.INTEGER,
  dateRead: DataTypes.DATEONLY,
  yearPublished: DataTypes.INTEGER,
  fiction: DataTypes.BOOLEAN,
  primaryGenre: DataTypes.STRING,
  dateStarted: DataTypes.DATEONLY,
  bookType: DataTypes.STRING,      // e.g., "Prose" or "Graphic Novel"
  targetAge: DataTypes.STRING      // e.g., "Adult", "Young Adult", etc.

});

module.exports = { sequelize, Book };