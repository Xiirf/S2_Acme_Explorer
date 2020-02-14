var mongoose = require('mongoose')
Actors = mongoose.model('Actors');

exports.list_all_actors = function(req, res) {
    Actors.find({}, function(err, actors) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json(actors);
        }
    })
}

exports.create_an_actor = function(req, res) {
    var new_actor = new Actors(req.body);
    new_actor.save(function(err, actor) {
        if(err) {
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
                console.error('Error getting data from DB');
                res.status(500).send(err);
            }
        } else {
            res.status(201);
            res.send(actor);
        }
    });
}

exports.read_an_actor = function(req, res) {
    var id = req.params.actorId;
    Actors.findById(id, function (err, actor) {
        if (err) {
          console.error('Error getting data from DB');
          res.status(500).send(err); // internal server error
        } else {
          if (actor) {
            console.info("Sending actor: " + JSON.stringify(actor, 2, null));
            res.send(actor);
          } else {
            console.warn("There are no actor with id " + id);
            res.sendStatus(404); // not found
          }
        }
      });
}

exports.edit_an_actor = function(req, res) {
    var updatedActor = req.body;
    var id = req.params.actorId;
    console.log(updatedActor)
    if (!updatedActor) {
        console.warn("New PUT request to /actor/ without actor, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New PUT request to /actor/" + id + " with data " + JSON.stringify(updatedActor, 2, null));
        Actors.findById(id, function(err, actor) {
            if (err) {
                console.error('Error updating data in DB');
                res.status(500).send(err); // internal server error
              } else {
                if (actor) {
                    actor = Object.assign(actor, updatedActor)
                    actor.save(function(err2, newActor) {
                        if (err2) {
                            if(err.name=='ValidationError') {
                                res.status(422).send(err2);
                            }
                            else{
                                console.error('Error updating data from DB');
                                res.status(500).send(err2);
                            }
                        } else {
                            res.send(newActor); // return the updated actor
                        }
                    });
                    
                } else {
                  console.warn("There are no actor with id " + id);
                  res.sendStatus(404); // not found
                }
            }
        });
    }
}

exports.handle_actor_banishment = function(req, res) {
    var banned = req.body ? req.body.banned : undefined;
    var id = req.params.actorId;
    if (!banned || typeof(banned) != "boolean") {
        console.warn("New PATCH request to /actor/id/ban without correct attribute banned, sending 400...");
        res.sendStatus(400);
    } else {
        console.info("New PATCH request to /actor/" + id + "/ban with value " + JSON.stringify(banned, 2, null));
        Actors.findOneAndUpdate({"_id": id}, { "banned": banned }, { new: true }, function(err, actor) {
            if (err) {
                if(err.name=='ValidationError') {
                    res.status(422).send(err);
                }
                else{
                    console.error('Error getting data from DB');
                    res.status(500).send(err);
                }
            } else {
                if (actor) {
                    res.send(actor); // return the updated actor
                } else {
                    console.warn("There are not any actor with id " + id);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
}

exports.delete_an_actor = function(req, res) {
    var id = req.params.actorId;
    Actors.findOneAndDelete({"_id": id}, null, function (err) {
      if (err) {
        console.error('Error removing data from DB');
        res.status(500).send(err); // internal server error
      } else {
        console.info("The actor with id " + id + " has been succesfully deleted, sending 204...");
        res.sendStatus(204); // no content
      }
    });
}
