const { query,validationResult } = require('express-validator/check');
const { sanitizeParam } = require('express-validator/filter');

var Book = require('../models/book');
var Author = require('../models/author');

// Return all Books on Get.
exports.book_list = function(req, res) {
  
  Book.find().populate('author').exec(function (err, list_books){
    if(err){ res.json({err}) }
    res.json( {'list_books' : list_books} )
  });
};


// Handle Book create on POST.
exports.book_create_post = [

    // Validate fields.
    query('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    query('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    query('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    query('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeParam('*').trim().escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const authorId = req.query.author;
        const author = await Author.findById(authorId);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.status(500).json({ title: 'Create Book', book: req.query, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var book = new Book(
                {
                    title: req.query.title,
                    author: req.query.author,
                    summary: req.query.summary,
                    isbn: req.query.isbn,
                    genre: req.query.genre
                });
            await book.save(function (err) {
                if (err) { res.json({err}) }
            });
        }

        // Update bookId in author
        author.book.push(book);
        await author.save();

        res.json(book)
    }
];

exports.add_author =  [
  query('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
  query('book', 'Book must not be empty.').isLength({ min: 1 }).trim(),

  sanitizeParam('*').trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const authorId = req.query.author;
    const author = await Author.findById(authorId);
    const bookId = req.query.book;
    const book = await Book.findById(bookId);


    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.status(500).json({ title: 'Add Author', errors: errors.array() });
      return
    }
    else {

      book.author.push(author);
      author.book.push(book);
      await book.save();
      await author.save();

      res.status(200).json(book)
    }
  }
];

exports.remove_author =  [
  async (req, res, next) => {
    const authorId = req.query.authorId;
    const author = await Author.findById(authorId);
    console.log(author)

    const bookId = req.query.bookId;
    const book = await Book.findById(bookId);
    console.log(book)

    book.author.pull(author);
    author.book.pull(book);
    await book.save();
    await author.save();

    res.json(book)
    // await Book.findOneAndUpdate({"_id": bookId}, { $push: { author: authorId })
  }
];