'use strict';

const express = require('express');
var routerV1 = express.Router();
var routerV2 = express.Router();
var authController = require('../controllers/v2/authController');

module.exports = function(app) {
    var findersV1 = require('../controllers/v1/finderController');
    var findersV2 = require('../controllers/v2/finderController');
    
    routerV1.route('/finders')
        .get(findersV1.list_all_finders)
        .post(findersV1.create_a_finder);
    routerV1.route('/finders/:finderId')
        .get(findersV1.read_a_finder)
        .put(findersV1.edit_a_finder)
        .delete(findersV1.delete_a_finder);
    
    routerV2.route('/finders')
        .get(authController.verifyUser(["Explorer"]), findersV2.list_all_finders)
        .post(authController.verifyUser(["Explorer"]), findersV2.create_a_finder);
    routerV2.route('/finders/:finderId')
        .get(authController.verifyUser(["Explorer"]), findersV2.read_a_finder)
        .put(authController.verifyUser(["Explorer"]), findersV2.edit_a_finder)
        .delete(authController.verifyUser(["Administrator"]), findersV2.delete_a_finder);
    
    app.use("/v1/", routerV1);
    app.use("/v2/", routerV2);
}