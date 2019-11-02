'use strict';

const Model = require('./model.js');
const schema = require('./users-schema.js');

class Users extends Model {
  constructor() {
    super(schema);
  }

  /**
   * Class model function wrapper for the 
   * authenicate mongoose function
   * @param  {object} creds
   * @returns  {object} authenticated user
   */
  authenticate(creds) {
    return this.schema.authenticate(creds);
  }
}

module.exports = Users;
