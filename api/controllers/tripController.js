var mongoose = require('mongoose')
Trips = mongoose.model('Trips');

exports.list_all_trips = function(req, res) {
    Trips.find({}), function(err, trips) {
        if(err) {
            res.send(err);
        } else {
            res.json(trips);
        }
    }
}

exports.create_a_trip = function(req, res) {
    var new_trip = new Trip(req.body);
    new_trip.save(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.sendStatus(201);
        }
    });
}

exports.read_a_trip = function(req, res) {
    Trips.findById(req.path.params.tripId, function(err, trip) {
        if(err) {
            res.send(err);
        } else {
            res.json(trip);
        }
    })
}

exports.edit_a_trip = function(req, res) {
    Trips.findOneAndUpdate({_id: req.path.params.tripsId}, req.body, null, function(err, trip) {
        if(err) {
            res.send(err);
        } else {
            res.json(trip);
        }
    })
}

exports.delete_a_trip = function(req, res) {
    Trips.deleteOne(req.path.params.tripsId, function(err) {
        if(err) {
            res.send(err);
        } else {
            res.json({message: 'Trip successfully deleted'});
        }
    })
}
