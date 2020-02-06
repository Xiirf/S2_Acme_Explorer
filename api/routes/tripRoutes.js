'use strict';
module.exports = function(app) {
    var trips = require('../controllers/tripController');
    
    app.route('/trips')
        .get(trips.list_all_trips)
    app.route('/trip')
        .post(trips.create_a_trip)
    app.route('/trip/:tripId')
        .post(trips.read_a_trip)
        .put(trips.edit_a_trip)
        .delete(trips.delete_a_trip)        
}