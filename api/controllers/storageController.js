'use strict';

/**
 * @swagger
 * path:
 *  /storage/insertMany:
 *    post:
 *      description: 'Insert a massive amount of pre-generated values in database'
 *      tags: [Storage]
 *      operationId: insertMany
 *      parameters:
 *        - name: mongooseModel
 *          in: query
 *          description: name of the model you wanna insert already generated values for
 *          required: true
 *          schema:
 *            type: string
 *        - name: sourceFile
 *          in: query
 *          description: name of the serveur file to retrieve values from
 *          required: true
 *          schema:
 *             type: string
 *      responses:
 *        "200":
 *          description: Massive insertion succedeed
 *        "400":
 *          description: Missing query parameter
 *        "500":
 *          description: Server error
 */
exports.store_json_insertMany = function(req, res) {
    //var dbURL, collection, sourceURL, batchSize, parseString = null;
    var mongooseModel, sourceFile = null;
    var response = '';
    
    if (req.query.mongooseModel && req.query.sourceFile){
      mongooseModel = req.query.mongooseModel;
      sourceFile = req.query.sourceFile;
      //if (req.query.batchSize) batchSize = req.query.batchSize; else batchSize = 1000;
      //if (req.query.parseString) parseString = req.query.parseString; else parseString = '*.*';
    
      var json = require(sourceFile);
      var mongoose = require('mongoose'),
        collectionModel = mongoose.model(mongooseModel);
  
      // where the data will end up
      console.log('inserting the json from file: '+sourceFile+', into the Model: '+mongooseModel);
      collectionModel.insertMany(json, function(err,result) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          response+= 'All documents stored in the collection!';
          console.log(response);
          res.status(201).send(response);
        }
     });
    } 
    else {
      if (req.query.mongooseModel == null) response+='A mandatory mongooseModel parameter is missed.\n';
      if (req.query.sourceFile == null) response+='A mandatory sourceFile parameter is missed.\n';
      console.log(response);
      res.status(400).send(response);
    } 
    
  };