var mongoose = require('mongoose')
Actors = mongoose.model('Actors');

exports.list_all_actors = function(req, res) {
    Actors.find({}, function(err, actors) {
        if(err) {
            res.send(err);
        } else {
            res.json(actors);
        }
    })
}

exports.create_an_actor = function(req, res) {
    var new_actor = new Actors(req.body);
    new_actor.save(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.sendStatus(201);
        }
    });
}

exports.read_an_actor = function(req, res) {
    var name = req.params.actorName;
    Actors.find({ "name": name }, function (err, filteredActors) {
        if (err) {
          console.error('Error getting data from DB');
          res.sendStatus(500); // internal server error
        } else {
          if (filteredActors.length > 0) {
            var actor = filteredActors[0]; //since we expect to have exactly ONE actor with this name
            console.info("Sending actor: " + JSON.stringify(actor, 2, null));
            res.send(actor);
          } else {
            console.warn("There are no actor with name " + name);
            res.sendStatus(404); // not found
          }
        }
      });
}

exports.edit_an_actor = function(req, res) {
    var updatedActor = req.body;
    var name = req.params.actorName;
    if (!updatedActor) {
        console.warn("New PUT request to /actor/ without actor, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New PUT request to /actor/" + name + " with data " + JSON.stringify(updatedActor, 2, null));
        Actors.findOneAndUpdate({"name": name}, req.body, null, function(err, actor) {
            if (err) {
                console.error('Error getting data from DB');
                res.sendStatus(500); // internal server error
            } else {
                if (actor) {
                console.info("Modifying actor with name " + name + " with data " + JSON.stringify(updatedActor, 2, null));
                res.send(Object.assign(actor, updatedActor)); // return the updated actor
                } else {
                console.warn("There are not any actor with name " + name);
                res.sendStatus(404); // not found
                }
            }
        });
    }
}

exports.delete_an_actor = function(req, res) {
    var name = req.params.actorName;
    Actors.deleteOne({ "name": name }, null, function (err) {
      if (err) {
        console.error('Error removing data from DB');
        res.sendStatus(500); // internal server error
      } else {
        console.info("The actor with name " + name + " has been succesfully deleted, sending 204...");
        res.sendStatus(204); // no content
      }
    });
}
