'use strict';

const express = require('express');
var routerv1 = express.Router();
var routerv2 = express.Router();

module.exports = function(app) {
    var findersv1 = require('../controllers/v1/globalVarsController');
    var findersv2 = require('../controllers/v2/globalVarsController');
    
    routerv1.route('/globalVars')
        .get(findersv1.list_global_vars);
    
    app.use("/v1/", routerv1);
    
    routerv2.route('/globalVars')
        .get(findersv2.list_global_vars);
    
    app.use("/v2/", routerv2);
}