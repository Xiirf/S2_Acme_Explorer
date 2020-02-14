var mongoose = require('mongoose')
Trips = mongoose.model('Trips');
Stages = mongoose.model('Stages');

exports.list_all_trips = function(req, res) {
    Trips.find({}, function(err, trips) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(trips);
        }
    });
}

exports.create_a_trip = function(req, res) {
    var new_trip = new Trips(req.body);
    // 1) Test si managerId est un actor avec le role de manager
    // Faire fonction pour récupérer l'actor et le role et utiliser le controller
    // 2) test si utilisateur connecté est bien le bon 
    new_trip.save(function(err) {
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
                res.status(500).send(err);
            }
        } else {
            res.status(201).json(new_trip);
        }
    });
}

exports.read_a_trip = function(req, res) {
    Trips.findById(req.params.tripId, function(err, trip) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json(trip);
        }
    })
}

exports.edit_a_trip = function(req, res) {
    // Voir si l'utilisateur est un admin ou manager

    Trips.findOneAndUpdate({_id: req.params.tripId}, req.body, {new:true, runValidators: true}, function(err, trip) {
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
              res.status(500).send(err);
            }
        } else {
            res.status(200).json(trip);
        }
    })
}

exports.delete_a_trip = function(req, res) {
    // Voir si l'utilisateur connecté est un admin ou manager
    Trips.remove({_id: req.params.tripId}, function(err) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json({message: 'Trip successfully deleted'});
        }
    })
}

exports.add_a_stage_in_trip = function(req, res) {
    // Voir si l'utilisateur connecté est un admin ou manager
    console.log(req.body);
    var stage = new Stages(req.body)
    console.log("ok")
    Trips.findOneAndUpdate({_id: req.params.tripId}, {$push: {stages: stage}}, {new:true, runValidators: true}, function(err, trip) {
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
                console.log(err);
              res.status(500).send(err);
            }
        } else {
            res.json(trip);
        }
    })
}
