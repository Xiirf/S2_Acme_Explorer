'use strict';

const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var findersv1 = require('../controllers/v1/globalVarsController');
    var findersv2 = require('../controllers/v2/globalVarsController');
    
    router.route('/globalVars')
        .get(findersv1.list_global_vars);
    
    app.use("/v1/", router);
    
    router.route('/globalVars')
        .get(findersv2.list_global_vars);
    
    app.use("/v2/", router);
}