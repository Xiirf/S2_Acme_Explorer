var mongoose = require('mongoose')
Actors = mongoose.model('Actors');

exports.list_all_actors = function(req, res) {
    Actors.find({}), function(err, actors) {
        if(err) {
            res.send(err);
        } else {
            res.json(actors);
        }
    }
}

exports.create_an_actor = function(req, res) {
    var new_actor = new Actor(req.body);
    new_actor.save(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.sendStatus(201);
        }
    });
}

exports.read_an_actor = function(req, res) {
    Actors.findById(req.path.params.actorId, function(err, actor) {
        if(err) {
            res.send(err);
        } else {
            res.json(actor);
        }
    })
}

exports.edit_an_actor = function(req, res) {
    Actors.findOneAndUpdate({_id: req.path.params.actorId}, req.body, null, function(err, actor) {
        if(err) {
            res.send(err);
        } else {
            res.json(actor);
        }
    })
}

exports.delete_an_actor = function(req, res) {
    Actors.deleteOne(req.path.params.actorId, function(err) {
        if(err) {
            res.send(err);
        } else {
            res.sendStatus(204);
        }
    })
}
