'use strict';

const express = require('express');
var routerv1 = express.Router();
var routerv2 = express.Router();
var authController = require('../controllers/v2/authController');

module.exports = function (app) {
    var globalVarsV1 = require('../controllers/v1/globalVarsController');
    var globalVarsV2 = require('../controllers/v2/globalVarsController');

    routerv1.route('/globalVars')
        .get(globalVarsV1.list_global_vars);
    routerv1.route('/globalVars/cacheTimeOutFinderResults')
        .patch(globalVarsV1.edit_cache_time_out);
    routerv1.route('/globalVars/maxNumberFinderResults')
        .patch(globalVarsV1.edit_max_number_finder_results);

    app.use("/v1/", routerv1);

    routerv2.route('/globalVars')
        .get(authController.verifyUser(['Administrator']), globalVarsV2.list_global_vars);
    routerv2.route('/globalVars/cacheTimeOutFinderResults')
        .patch(authController.verifyUser(['Administrator']), globalVarsV2.edit_cache_time_out);
    routerv2.route('/globalVars/maxNumberFinderResults')
        .patch(authController.verifyUser(['Administrator']), globalVarsV2.edit_max_number_finder_results);

    app.use("/v2/", routerv2);
}