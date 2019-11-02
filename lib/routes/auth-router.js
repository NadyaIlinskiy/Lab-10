'use strict';

const express = require('express');
const router = express.Router();

const Users = require('../models/users-model.js');
const users = new Users();

/**
 * When the signup endpoint is called
 * Create a user 
 * @param  {object} req.body
 */
const create = async (req, res, next) => {
  let user = await users.create(req.body);
  // eslint-disable-next-line require-atomic-updates
  req.user = user && user._id ? user : null;

  next();
};

/**
 * When the signin endpoint is called
 * Authenticating the user with req.body
 * @param  {object} req.body
 */
const authenticate = async (req, res, next) => {
  let user = await users.authenticate(req.body);
  // eslint-disable-next-line require-atomic-updates
  req.user = user && user._id ? user : null;

  next();
};

// TODO README Question
const setToken = (req, res, next) => {
  if (req.user) {
    let token = req.user.generateToken();

    // Setting the token value in the response header
    res.set('token', token);

    // TODO README Question
    // Sets a cookie with the token value which is sent with the response
    res.cookie('token', token);

    res.send('Successfully authenticated and logged in');
  } else res.send('Unable to authenticate and log in');
};

/**
 * POST request to the signup endpoint
 * The create function will create the user
 * The setToken will send a token back in the response
 * @route POST '/signup'
 * @returns {} 200
 */
router.post('/signup', create, setToken);

/**
 * Post request for the signin endpoint
 * The authenticate function will authenticate the user
 * The setToken will send a token back in the response
 * @route POST '/signin'
 * @returns {} 200
 */
router.post('/signin', authenticate, setToken);

module.exports = router;
