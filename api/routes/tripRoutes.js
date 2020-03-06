'use strict';

const express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');

module.exports = function(app) {
    var trips = require('../controllers/tripController');
    
    router.route('/trips')
        .get(trips.list_all_trips)
        .post(authController.verifyUser(["Manager"]), trips.create_a_trip);
    router.route('/trips/search')
        .get(trips.search_trips)
    router.route('/trips/:tripId')
        .get(trips.read_a_trip)
        .put(authController.verifyUser(["Manager"]), trips.edit_a_trip)
        .delete(authController.verifyUser(["Manager"]), trips.delete_a_trip);
    router.route('/trips/:tripId/stage')
        .patch(authController.verifyUser(["Manager"]), trips.add_a_stage_in_trip);
    router.route('/trips/:tripId/cancel')
        .patch(authController.verifyUser(["Manager"]), trips.cancel_a_trip);
    
    app.use("/v1/", router);
}