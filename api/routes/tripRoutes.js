'use strict';

const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var trips = require('../controllers/tripController');
    
    router.route('/trips')
        .get(trips.list_all_trips)
        .post(trips.create_a_trip);
    router.route('/trips/:tripId')
        .get(trips.read_a_trip)
        .put(trips.edit_a_trip)
        .delete(trips.delete_a_trip);
    router.route('/trips/:tripId/stage')
        .patch(trips.add_a_stage_in_trip);
    router.route('/trips/:tripId/cancel')
        .patch(trips.cancel_a_trip);
    
    app.use("/v1/", router);
}