const { query,validationResult } = require('express-validator/check');
const { sanitizeParam } = require('express-validator/filter');

var Author = require('../models/author');

// Display list of all Authors.
exports.author_list = function(req, res) {

  Author.find().populate('book').exec(function (err, list_authors){
    if(err){ res.json({err}) }
    res.json( {'list_authors' : list_authors} )
  });
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = [
    
    // Validate fields.
    query('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    query('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    query('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    query('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeParam('first_name').trim().escape(),
    sanitizeParam('family_name').trim().escape(),
    sanitizeParam('date_of_birth').toDate(),
    sanitizeParam('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.json({ title: 'Create Author', author: req.query, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    first_name: req.query.first_name,
                    family_name: req.query.family_name,
                    date_of_birth: req.query.date_of_birth,
                    date_of_death: req.query.date_of_death
                });
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.json({author});
            });
        }
    }
];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};