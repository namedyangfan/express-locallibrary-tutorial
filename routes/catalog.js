var express = require('express');
var router = express.Router();

var author_controller = require('../controllers/authorController');
var book_controller = require('../controllers/bookController');

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request for list all Authors.
router.get('/authors', author_controller.author_list);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request for list all Authors.
router.get('/books', book_controller.book_list);

// PUT request add Authors for a bookc .
router.put('/book/add_author', book_controller.add_author);

// PUT request remove Authors for a bookc .
router.put('/book/remove_author', book_controller.remove_author);

module.exports = router;

