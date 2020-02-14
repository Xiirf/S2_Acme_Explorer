'use strict';
module.exports = function(app) {
    var trips = require('../controllers/tripController');
    
    app.route('/trips')
        .get(trips.list_all_trips)
        .post(trips.create_a_trip)
    app.route('/trips/:tripId')
        .get(trips.read_a_trip)
        .put(trips.edit_a_trip)
        .delete(trips.delete_a_trip)        
}