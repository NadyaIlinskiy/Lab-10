'use strict';

// == EXTERNAL RESOURCES ===============================================

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// == INTERNAL RESOURCES ===============================================

const errorHandler = require('./middleware/error.js');
const notFound = require('./middleware/404.js');
const authRouter = require('./routes/auth-router.js');
const bookRouter = require('./routes/book-router.js');
const app = express();

// == APPLICATION MIDDLEWARE ============================================

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// == ROUTES ===========================================================

/**
 * Homepage route for the site
 * @route GET /
 * @returns {string} 200 - Homepage
 */
app.get('/', (req, res, next) => {
  res.send('Homepage');
});

// Calls the auth router middleware every time a request 
// to signup or signin  endpoint is sent to the server
app.use(authRouter);

// Calls the book router middleware every time a request
// to the books endpoint is sent to the server
app.use(bookRouter);

// This is middleware that will fire on 404 errors
// Will run on any route that is not defined
app.use(notFound);

// This is middleware that will fire on server errors (500)
app.use(errorHandler);

// == EXPORTS ===========================================================

module.exports = {
  server: app,

  start: port => {
    const PORT = port || process.env.PORT || 3000;

    // Tells the server what PORT to listen to
    // If there is a PORT declared in env will use that
    // Else defaults to 3000
    app.listen(PORT, () => {
      console.log(`Server Up on ${PORT}`);
    });

    // Configs needed to connect to mongoose 
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };

    const path = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/app';
    mongoose.connect(path, options);
  },
};
