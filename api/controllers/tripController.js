/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trips organize
 */
var mongoose = require('mongoose')
Trips = mongoose.model('Trips');
Stages = mongoose.model('Stages');

/**
 * @swagger
 * path:
 *  /trips:
 *    get:
 *      summary: Get all trips
 *      tags: [Trips]
 *      responses:
 *        "200":
 *          description: Return all trips
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Trip'
 *        "500":
 *          description: Internal error
 */
exports.list_all_trips = function(req, res) {
    Trips.find({}, function(err, trips) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(trips);
        }
    });
    
}


/**
 * @swagger
 * path:
 *  /trips/search:
 *    get:
 *      summary: Get all trips
 *      tags: [Trips]
 *      parameters:
 *         - name: keyword
 *           in: query
 *           description: keyword for research
 *           required: false
 *           schema:
 *             type: string
 *         - name: dateMin
 *           in: query
 *           description: Date min
 *           required: false
 *           schema:
 *             type: date
 *         - name: dateMax
 *           in: query
 *           description: Date max
 *           required: false
 *           schema:
 *             type: date
 *         - name: priceMin
 *           in: query
 *           description: Price min
 *           required: false
 *           schema:
 *             type: number
 *         - name: priceMax
 *           in: query
 *           description: Price max
 *           required: false
 *           schema:
 *             type: number
 *      responses:
 *        "200":
 *          description: Return all trips
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Trip'
 *        "500":
 *          description: Internal error
 */
exports.search_trips = function(req, res) {
    var query = {};
    
    if(req.query.keyword){
        query.$text = {$search: req.query.keyword};
    }
    if(req.query.dateMin){
        query.start = {$gte: new Date(req.query.dateMin)};
    }
    if(req.query.dateMax){
        query.end = {$lt: new Date(req.query.dateMax)};
    }
    if(req.query.priceMin){
        query.price = [];
        query.price = {$gte: req.query.priceMin};
    }
    if(req.query.priceMax){
        query.price = {$lt: req.query.priceMax};
    }
    if (req.query.priceMin && req.query.priceMax){
        query.price = { $gte: req.query.priceMin, $lt: req.query.priceMax };
    }

    Trips.find(query)
        .lean()
        .exec(function(err, trip){
            if (err){
                res.send(err);
            } else {
                res.json(trip);
            }
        });
}

/**
 * @swagger
 * path:
 *  /trips:
 *    post:
 *      summary: Create a Trip
 *      tags: [Trips]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Trip'
 *      responses:
 *        "201":
 *          description: Trip created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Trip'
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Server error
 */
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

/**
 * @swagger
 * path:
 *  /trips/{tripId}:
 *    get:
 *      summary: Get a trip
 *      tags: [Trips]
 *      parameters:
 *         - name: tripId
 *           in: path
 *           description: trip Id
 *           required: true
 *           schema:
 *             type: string
 *      responses:
 *        "200":
 *          description: Return a trip
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Trip'
 *        "404":
 *          description: Ressource not found
 *        "500":
 *          description: Internal error
 */
exports.read_a_trip = function(req, res) {
    Trips.findById(req.params.tripId, function(err, trip) {
        if(err) {
            res.status(500).send(err);
        } else if (!trip) {
            res.status(404)
                .json({ error: 'No se ha encontrado la ID.'});
        } else {
            res.json(trip);
        }
    })
}

/**
 * @swagger
 * path:
 *  /trips/{tripId}:
 *    put:
 *      summary: Edit a trip
 *      tags: [Trips]
 *      parameters:
 *         - name: tripId
 *           in: path
 *           description: trip Id
 *           required: true
 *           schema:
 *             type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - title
 *              properties:
 *                title:
 *                  type: string
 *                  description: trip title.
 *              example:
 *                title: titleUpdate
 *      responses:
 *        "200":
 *          description: Trip updated
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Trip'
 *        "404":
 *          description: Ressource not found
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Internal error
 */
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
        } else if (!trip) {
            res.status(404)
                .json({ error: 'No se ha encontrado la ID.'});
        } else {
            res.status(200).json(trip);
        }
    })
}

/**
 * @swagger
 * path:
 *  /trips/{tripId}:
 *    delete:
 *      summary: Delete a trip
 *      tags: [Trips]
 *      parameters:
 *         - name: tripId
 *           in: path
 *           description: trip Id
 *           required: true
 *           schema:
 *             type: string
 *      responses:
 *        "200":
 *          description: Item delete msg
 *        "500":
 *          description: Internal error
 */
exports.delete_a_trip = function(req, res) {
    // Voir si l'utilisateur connecté est un admin ou manager
    Trips.findOneAndDelete({_id: req.params.tripId}, function(err, trip) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json({message: 'Trip successfully deleted', trip});
        }
    })
}

/**
 * @swagger
 * path:
 *  /trips/{tripId}/stage:
 *    patch:
 *      summary: Add a stage in a trip
 *      tags: [Trips]
 *      parameters:
 *         - name: tripId
 *           in: path
 *           description: trip Id
 *           required: true
 *           schema:
 *             type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Stage'
 *      responses:
 *        "200":
 *          description: Trip updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Trip'
 *        "404":
 *          description: Ressource not found
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Internal error
 */
exports.add_a_stage_in_trip = function(req, res) {
    // Voir si l'utilisateur connecté est un admin ou manager
    var id = req.params.tripId;
    var stage = new Stages(req.body)
    if (!stage) {
        res.status(400) // bad request
            .json({ error: 'No se ha encontrado el nuevo stage.'});
    } else {
        Trips.findById(id, function(err, trip) {
            if (err) {
                res.status(500).send(err); // internal server error
              } else {
                if (trip) {
                    trip.stages.push(stage);
                    trip.save(function(err2, newTrip) {
                        if (err2) {
                            if(err.name=='ValidationError') {
                                res.status(422).send(err2);
                            }
                            else{
                                res.status(500).send(err2);
                            }
                        } else {
                            res.send(newTrip); // return the updated actor
                        }
                    });
                } else {
                  res.sendStatus(404); // not found
                }
            }
        });
    }
}

/**
 * @swagger
 * path:
 *  /trips/{tripId}/cancel:
 *    patch:
 *      summary: cancel the trip
 *      tags: [Trips]
 *      parameters:
 *         - name: tripId
 *           in: path
 *           description: trip Id
 *           required: true
 *           schema:
 *             type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - reasonCancelling
 *              properties:
 *                reasonCancelling:
 *                  type: string
 *                  description: trip reason cancelling.
 *              example:
 *                reasonCancelling: reason1
 *      responses:
 *        "200":
 *          description: Trip updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Trip'
 *        "400":
 *          description: Bad request
 *        "404":
 *          description: Ressource not found
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Internal error
 */
exports.cancel_a_trip = function(req, res) {
    // Voir si l'utilisateur connecté est un admin ou manager
    var reasonCancelling = req.body.reasonCancelling;
    var id = req.params.tripId;
    if (!reasonCancelling) {
        res.status(400) // bad request
            .json({ error: 'No se ha encontrado la razón de la cancelación.'});
    } else {
        Trips.findById(id, function(err, trip) {
            if (err) {
                res.status(500).send(err); // internal server error
              } else {
                if (trip) {
                    if (trip.cancelled){
                        res.status(400) // bad request beacause trip already cancelled
                            .json({ error: 'Trip ya cancelado'});
                    } else {
                        trip.cancelled = true;
                        trip.reasonCancelling = reasonCancelling;
                        trip.save(function(err2, newTrip) {
                            if (err2) {
                                if(err.name=='ValidationError') {
                                    res.status(422).send(err2);
                                }
                                else{
                                    res.status(500).send(err2);
                                }
                            } else {
                                res.send(newTrip); // return the updated actor
                            }
                        });
                    }
                } else {
                  res.sendStatus(404); // not found
                }
            }
        });
    }
}
