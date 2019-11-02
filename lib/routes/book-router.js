'use strict';

const express = require('express');
const router = express.Router();

let books = [
  { title: 'Brave New World', auth: ['admin'] },
  { title: 'Hamlet', auth: ['admin', 'editor'] },
  { title: 'Alice in Wonderland', auth: ['admin', 'editor', 'user'] },
];

/**
 * 
 * @route GET '/books'
 * @returns {object} 200
 * @returns {Error}  500 - Server error
 */
// TODO Edit code (see lab README)
router.get('/books', (req, res, next) => {
  let library = {
    count: books.length,
    results: books,
  };
  res.status(200).json(library);
});

/**
 * Getting a book at a particular index
 * If the index does not exist, 'Book not found'
 * @route GET '/books/:idx'
 * @returns {object} 200
 * @returns {Error}  500 - Server error
 */
// TODO Edit code (see lab README)
router.get('/books/:indx', (req, res, next) => {
  if (req.params.indx < books.length) {
    let book = books[req.params.indx];
    res.status(200).json(book);
  } else {
    res.send('Book not Found');
  }
});

module.exports = router;
