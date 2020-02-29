'use strict';

const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var finders = require('../controllers/globalVarsController');
    
    router.route('/globalVars')
        .get(finders.list_global_vars);
    
    app.use("/v1/", router);
}