'use strict';

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
        res.send(err);
        } else {
          response+= 'All documents stored in the collection!';
          console.log(response);
          res.send(response);
        }
     });
    } 
    else {
      if (req.query.mongooseModel == null) response+='A mandatory mongooseModel parameter is missed.\n';
      if (req.query.sourceFile == null) response+='A mandatory sourceFile parameter is missed.\n';
      console.log(response);
      res.send(response);
    } 
    
  };