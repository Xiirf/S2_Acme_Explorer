'use strict';
module.exports = function(app) {
	var storage = require('../controllers/storageController');

  // Data Storage routes

  /**
	 * Put a large json with documents from a file into a collection of mongoDB
	 *
	 * @section storage
	 * @type post
	 * @url /v1/storage/fs
	 * @param {string} dbURL       //mandatory
     * @param {string} collection  //mandatory
	 * @param {string} sourceURL   //mandatory
	 * @param {string} batchSize   //optional
	 * @param {string} parseString //optional
	 * Sample 1: http://localhost:8080/v1/storage/fs?dbURL=mongodb://simpleUser:123456@localhost:27017/ACME-Explorer&collection=actors&batchSize=100&parseString=rows.*&sourceFile=./dataActors.json
	 * 
	 * Sample 2: http://localhost:8080/v1/storage/fs?dbURL=mongodb://myUser:myUserPassword@localhost:27017/ACME-Market&collection=actors&batchSize=100&parseString=*&sourceFile=c:\temp\Customer.json
  */
  app.route('/v1/storage/fs')
		.post(storage.store_json_fs);
};