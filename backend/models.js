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
  tbr: DataTypes.BOOLEAN
});

module.exports = { sequelize, Book };