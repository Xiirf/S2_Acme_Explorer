'use strict';

const express = require('express');
var routerV1 = express.Router();
var routerV2 = express.Router();
var authController = require('../controllers/v2/authController');

module.exports = function(app) {
    var poisV1 = require('../controllers/v1/poiController');
    var poisV2 = require('../controllers/v2/poiController');
    
    routerV1.route('/pois')
        .get(poisV1.list_all_pois)
        .post(poisV1.create_a_poi);
    routerV1.route('/pois/:poiId')
        .get(poisV1.read_a_poi)
        .put(poisV1.edit_a_poi)
        .delete(poisV1.delete_a_poi);

    routerV2.route('/pois')
        .get(authController.verifyUser(["Explorer", "Manager", "Sponsor", "Administrator"]), poisV2.list_all_pois)
        .post(authController.verifyUser(["Administrator"]), poisV2.create_a_poi);
    routerV2.route('/pois/:poiId')
        .get(authController.verifyUser(["Explorer", "Manager", "Sponsor", "Administrator"]), poisV2.read_a_poi)
        .put(authController.verifyUser(["Administrator"]), poisV2.edit_a_poi)
        .delete(authController.verifyUser(["Administrator"]), poisV2.delete_a_poi);

    app.use("/v1/", routerV1);
    app.use("/v2/", routerV2);
}