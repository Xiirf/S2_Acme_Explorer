'use strict';

const express = require('express');
var routerV1 = express.Router();
var routerV2 = express.Router();
var authController = require('../controllers/authController');

module.exports = function(app) {
    var tripsV1 = require('../controllers/v1/tripController');
    var tripsV2 = require('../controllers/v2/tripController');

    routerV1.route('/trips')
        .get(tripsV1.list_all_trips)
        .post(tripsV1.create_a_trip);
    routerV1.route('/trips/search')
        .get(tripsV1.search_trips)
    routerV1.route('/trips/:tripId')
        .get(tripsV1.read_a_trip)
        .put(tripsV1.edit_a_trip)
        .delete(tripsV1.delete_a_trip);
    routerV1.route('/trips/:tripId/stage')
        .patch(tripsV1.add_a_stage_in_trip);
    routerV1.route('/trips/:tripId/cancel')
        .patch(tripsV1.cancel_a_trip);
    
    app.use("/v1/", routerV1);

    routerV2.route('/trips')
        .get(tripsV2.list_all_trips)
        .post(authController.verifyUser(["Manager"]), tripsV2.create_a_trip);
    routerV2.route('/trips/search')
        .get(tripsV2.search_trips)
    routerV2.route('/trips/:tripId')
        .get(tripsV2.read_a_trip)
        .put(authController.verifyUser(["Manager"]), tripsV2.edit_a_trip)
        .delete(authController.verifyUser(["Manager"]), tripsV2.delete_a_trip);
    routerV2.route('/trips/:tripId/stage')
        .patch(authController.verifyUser(["Manager"]), tripsV2.add_a_stage_in_trip);
    routerV2.route('/trips/:tripId/cancel')
        .patch(authController.verifyUser(["Manager"]), tripsV2.cancel_a_trip);
    
    app.use("/v2/", routerV2);
}