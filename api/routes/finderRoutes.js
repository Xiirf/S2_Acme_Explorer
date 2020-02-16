'use strict';

const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var finders = require('../controllers/finderController');
    
    router.route('finders')
        .get(finders.list_all_finders)
        .post(finders.create_a_finder);
    router.route('finders/:finderId')
        .get(finders.read_a_finder)
        .put(finders.edit_a_finder)
        .delete(finders.delete_a_finder);
    
    app.use("/v1/", router);
}