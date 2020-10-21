const express = require('express');
const app = express();
const Joi = require('joi'); // The most powerful schema description language and data validator for JavaScript.
const morgan = require('morgan'); // HTTP request logger middleware for node.js.
const helmet = require('helmet'); // Helmet helps you secure your Express apps by setting various HTTP headers.

//Custom packages
const logger = require('./logger');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); //access the sample static file

app.use(helmet());
app.use(morgan('tiny'));

//Custom middleware
app.use(logger);

const books = [
    { id: 1, name: 'Clean Architecture' },
    { id: 2, name: 'FactFulness' },
    { id: 3, name: 'The Pragmatic Programmer' },
];

app.get('/api/books', (req, res) => {
    res.send(books);
});


app.post('/api/books', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const book = {
        id: books.length + 1,
        name: req.body.name
    };
    books.push(book);
    res.send(book);
});

app.put('/api/books/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('The book with the given ID was not found.');

    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    book.name = req.body.name;
    res.send(book);
});

app.delete('/api/books/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('The book with the given ID was not found.');

    const index = books.indexOf(book);
    books.splice(index, 1);

    res.send(book);
});

app.get('/api/books/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('The book with the given ID was not found.');
    res.send(book);
});

function validateBook(book) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(book, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));