'use strict';
module.exports = function(app) {
	var storage = require('../controllers/storageController');

  // Data Storage routes

  /**
	 * Bad option: Put a large json with documents from a file into a collection of mongoDB
	 *
	 * @section storage
	 * @type post
	 * @url /v1/storage/insertMany
     * @param {string} mongooseModel  //mandatory
	 * @param {string} sourceFile   //mandatory
	 */
 app.route('/v1/storage/insertMany')
 .post(storage.store_json_insertMany);
};