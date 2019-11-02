'use strict';

// == EXTERNAL RESOURCES ===============================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// == DEFINE THE USER SCHEMA =============================================

// Creating user schema that mongoose will use to validate
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'editor', 'user'],
  },
});

/**
 * Before a user is saved, run this function
 * @param  {}
 */
users.pre('save', async function() {
  // TODO README Question
  // What does .isModified do and why do we use it?
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

/**
 * Function to authenicate a user
 * Will find a user by username and check if the password is correct
 * @param  {object} creds
 * @returns {boolean}
 */
users.statics.authenticate = async function(creds) {
  let query = { username: creds.username };

  let user = await this.findOne(query);
  let isValid = user.comparePassword(creds.password);
  
  if (user) {
    return (user && isValid);
  }

};

/**
 * Ran on a single record
 * Uses bycrpt to check if password passed in is same as password in db
 * @param  {} password
 * @returns  {boolean} valid
 */
users.methods.comparePassword = async function(password) {
  let valid = await bcrypt.compare(password, this.password);
  
  return valid;
};

/**
 * When a user successfully logs in, generate a JWT token
 * @param  {}
 */
users.methods.generateToken = function() {
  let tokenData = { id: this._id };
  return jwt.sign(tokenData, process.env.SECRET || 'this-is-my-secret');
};

module.exports = mongoose.model('users', users);
