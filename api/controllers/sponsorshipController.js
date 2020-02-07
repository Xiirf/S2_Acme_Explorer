var mongoose = require('mongoose')
Sponsorships = mongoose.model('Sponsorships');

exports.list_all_sponsorships = function(req, res) {
    Sponsorships.find({}, function(err, sponsorships) {
        if(err) {
            res.send(err);
        } else {
            res.json(sponsorships);
        }
    })
}

exports.create_a_sponsorship = function(req, res) {
    var new_sponsorship = new Sponsorships(req.body);
    Actors.findById(new_sponsorship.sponsorId, function(err, actor) {
        if(err) {
            console.error('Error getting data from DB');
            res.sendStatus(500); // internal server error
        } else if(actor && actor.role == "Sponsor") {
            new_sponsorship.save(function(err, sponsorship) {
                if(err) {
                    res.send(err);
                } else {
                    res.status(201);
                    res.send(sponsorship);
                }
            });
        } else {
            console.warn("There are no sponsor with id " + new_sponsorship.sponsorId);
            res.sendStatus(422);
        }
    });
}

exports.read_a_sponsorship = function(req, res) {
    var id = req.params.sponsorshipId;
    Sponsorships.findById(id, function (err, sponsorship) {
        if (err) {
          console.error('Error getting data from DB');
          res.sendStatus(500); // internal server error
        } else {
          if (sponsorship) {
            console.info("Sending sponsorship: " + JSON.stringify(sponsorship, 2, null));
            res.send(sponsorship);
          } else {
            console.warn("There are no sponsorship with id " + id);
            res.sendStatus(404); // not found
          }
        }
    });
}

exports.edit_a_sponsorship = function(req, res) {
    var updatedSponsorship = req.body;
    var id = req.params.sponsorshipId;
    if (!updatedSponsorship) {
        console.warn("New PUT request to /sponsorship/ without sponsorship, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        if(updatedSponsorship.sponsorId) {
            delete updatedSponsorship.sponsorId;
        }
        if(updatedSponsorship.tripId) {
            delete updatedSponsorship.tripId;
        }
        console.info("New PUT request to /sponsorship/" + id + " with data " + JSON.stringify(updatedSponsorship, 2, null));
        Sponsorships.findOneAndUpdate({"_id": id}, updatedSponsorship, null, function(err, sponsorship) {
            if (err) {
                console.error('Error getting data from DB');
                res.sendStatus(500); // internal server error
            } else {
                if (sponsorship) {
                    console.info("Modifying sponsorship with id " + id + " with data " + JSON.stringify(updatedSponsorship, 2, null));
                    res.send(Object.assign(sponsorship, updatedSponsorship)); // return the updated sponsorship
                } else {
                    console.warn("There are not any sponsorship with id " + id);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
}

exports.delete_a_sponsorship = function(req, res) {
    var id = req.params.sponsorshipId;
    Sponsorships.findOneAndDelete({"_id": id}, null, function (err) {
      if (err) {
        console.error('Error removing data from DB');
        res.sendStatus(500); // internal server error
      } else {
        console.info("The sponsorship with id " + id + " has been succesfully deleted, sending 204...");
        res.sendStatus(204); // no content
      }
    });
}
