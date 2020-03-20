/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trips organize
 */
var mongoose = require('mongoose')
Trips = mongoose.model('Trips');
Stages = mongoose.model('Stages');
Applications = require('../../models/applicationModel');
var authController = require('./authController');
var LangDictionnary = require('../../langDictionnary');
var Cacheman = require('cacheman');
var dict = new LangDictionnary();

var cache = new Cacheman('trips');

/**
 * @swagger
 * path:
 *  /trips:
 *    get:
 *      summary: Get all trips according to the query params
 *      tags: [Trips]
 *      parameters:
 *         - $ref: '#/components/parameters/language'
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
    var token = req.headers['authorization'];
    var lang = dict.getLang(req);
    authController.getUserRoleAndId(token)
        .then((actor) => {
            var query = {};
            if (actor.role == "Manager") {
                query = {managerId: actor.id};
            } else if (actor.role == "Explorer") {
                query = {published: true};
            }
            Trips.find(query, function(err, trips) {
                if(err) {
                    res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                } else {
                    res.status(200).json(trips);
                }
            });
        })
        .catch((err) => {
            return res.status(500).send(err);
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
 *         - $ref: '#/components/parameters/language'
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
    var lang = dict.getLang(req);
    var keyCache = "";

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
    query.published = true;
    query.cancelled = false;

    keyCache = JSON.stringify(query);

    cache.get(keyCache)
        .then((value) => {
            if (value == null) {
                GlobalVars.find({}, function(err, globalVars) {
                    if(err) {
                        res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                    } else {
                        Trips.find(query)
                            .lean()
                            .limit(globalVars.maxNumberFinderResults)
                            .exec(function(err, trip){
                                if(err) {
                                    res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                                } else {
                                    cache.set(keyCache, trip, globalVars.cacheTimeOutFinderResults + 'h');
                                    res.status(200).json(trip);
                                }
                            });
                    }
                });
            }
            else {
                res.status(200).json(value);
            }
        })
}

/**
 * @swagger
 * path:
 *  /trips:
 *    post:
 *      summary: Create a Trip
 *      tags: [Trips]
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - title
 *                - description
 *                - requirements
 *                - start
 *                - end
 *              properties:
 *                title:
 *                  type: string
 *                  description: Trip title.
 *                description:
 *                  type: string
 *                  description: Trip description.
 *                requirements:
 *                  type: array
 *                  items: string
 *                  description: Trip requirements.
 *                start:
 *                  type: Date
 *                  description: Trip start date.
 *                end:
 *                  type: Date
 *                  description: Trip end date.
 *                pictures:
 *                  type: array
 *                  items: object
 *                  properties:
 *                    data:
 *                      type: Buffer
 *                    contentType:
 *                      type: string
 *                  description: Array of Trip pictures.
 *                stages:
 *                  type: array
 *                  items: object
 *                  $ref: '#/components/schemas/Stage'
 *                  description: Array of Trip pictures.
 *              example:
 *                title: titleUpdate
 *                description: descTrip
 *                requirementes: ["testReq"]
 *                start: 2020-02-14
 *                end: 2020-02-14
 *                stages:
 *                  title: testExample
 *                  description: desExample
 *                  price: 250
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
    var lang = dict.getLang(req);
    var token = req.headers['authorization'];
    var new_trip = new Trips(req.body);

    //Use Actual Manager id
    authController.getUserId(token)
    .then((managerId) => {
        new_trip.managerId= managerId;
        new_trip.save(function(err) {
            if (err){
                if(err.name=='ValidationError') {
                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                }
                else{
                    res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
                }
            } else {
                cache.clear();
                res.status(201).json(new_trip);
            }
        });
    })
    .catch((err) => {
        res.status(500).send(err);
    })
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
 *         - $ref: '#/components/parameters/language'
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
    unique_find(req, res);
}

unique_find = function(req, res) {
    var lang = dict.getLang(req);
    Trips.findById(req.params.tripId, function(err, trip) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } else if (!trip) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'trip', req.params.tripId) });
        } else {
            res.status(200).json(trip);
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
 *         - $ref: '#/components/parameters/language'
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
 *        "414":
 *          description: PreconditionFailed
 *        "404":
 *          description: Ressource not found
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Internal error
 */
exports.edit_a_trip = function(req, res) {
    var lang = dict.getLang(req);
    Trips.findById({_id: req.params.tripId}, function(err, trip) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } else {
            if (trip) {
                verifyManagerTripOwner(req.headers['authorization'], trip.managerId)
                    .then((isSame) => {
                        if (isSame) {
                            if(!trip.published || trip.cancelled) {
                                Trips.updateOne({_id: req.params.tripId}, req.body, {new:true, runValidators: true}, function(err, trip) {
                                    if (err){
                                        if(err.name=='ValidationError') {
                                            res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                                        }
                                        else{
                                            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                                        }
                                    } else if (!trip) {
                                        res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'trip', req.params.tripId) });
                                    } else {
                                        cache.clear();
                                        unique_find(req, res);
                                    }
                                });
                            } else {
                                res.status(414).send({ err: dict.get('PreconditionFailed', lang) });
                            }
                        } else {
                            res.status(401).send({ err: dict.get('Unauthorized', lang) });
                        }
                    })
                    .catch((error) => {
                        res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                    });
            } else {
                res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'trip', req.params.tripId) });
            }
        }
    });
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
 *         - $ref: '#/components/parameters/language'
 *      responses:
 *        "204":
 *          description: Item delete
 *        "400":
 *          description: Bad Request
 *        "401":
 *          description: Unauthorized
 *        "414":
 *          description: Precondition Failed
 *        "404":
 *          description: Not found
 *        "500":
 *          description: Internal error
 */
exports.delete_a_trip = function(req, res) {
    var lang = dict.getLang(req);
    Trips.findById({_id: req.params.tripId}, function(err, trip) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } else {
            if (trip) {
                verifyManagerTripOwner(req.headers['authorization'], trip.managerId)
                .then((isSame) => {
                    if (isSame) {
                        if(!trip.published){
                            Trips.deleteOne({_id: req.params.tripId}, function(err) {
                                if(err) {
                                    res.status(500).send({ err: dict.get('ErrorDeleteDB', lang) });
                                } else {
                                    cache.clear();
                                    res.sendStatus(204);
                                }
                            });
                        } else {
                            res.status(414).send({ err: dict.get('PreconditionFailed', lang) });
                        }
                    } else {
                        res.status(401).send({ err: dict.get('Unauthorized', lang) });
                    }
                })
                .catch((error) => {
                    res.status(500).send(error);
                });
            } else {
                res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'trip', req.params.tripId) });
            }
        }
    });
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
 *         - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - stages
 *              properties:
 *                stages:
 *                  type: array
 *                  items: object
 *                  $ref: '#/components/schemas/Stage'
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
    var lang = dict.getLang(req);
    var id = req.params.tripId;
    var stages = req.body.stages;
    if (!stages) {
        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
    } else {
        Trips.findById(id, function(err, trip) {
            if (err) {
                res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
              } else {
                if (trip) {
                    verifyManagerTripOwner(req.headers['authorization'], trip.managerId)
                        .then((isSame) => {
                            if (isSame) {
                                if (trip.cancelled){
                                    res.status(422).send({ err: dict.get('AlreadyCancelled', lang) });
                                } else if(!trip.published){
                                    for (var stage of stages){
                                        var stageToAdd = new Stages(stage)
                                        trip.stages.push(stageToAdd);
                                    }
                                    trip.save(function(err2, newTrip) {
                                        if (err2) {
                                            if(err2.name=='ValidationError') {
                                                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                                            }
                                            else{
                                                res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                                            }
                                        } else {
                                            cache.clear();
                                            res.status(200).send(newTrip); // return the updated actor
                                        }
                                    });
                                } else {
                                    res.status(414).send({ err: dict.get('PreconditionFailed', lang) });
                                }
                            } else {
                                res.status(401).send({ err: dict.get('Unauthorized', lang) });
                            }
                        })
                        .catch((error) => {
                            res.status(500).send(error);
                        });
                } else {
                    res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'trip', req.params.tripId) });
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
 *         - $ref: '#/components/parameters/language'
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
 *        "414":
 *          description: Precondition Failed
 *        "404":
 *          description: Ressource not found
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Internal error
 */
exports.cancel_a_trip = function(req, res) {
    var lang = dict.getLang(req);
    var reasonCancelling = req.body.reasonCancelling;
    var id = req.params.tripId;
    if (!reasonCancelling) {
        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
    } else {
        Trips.findById(id, function(err, trip) {
            if (err) {
                res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
              } else {
                if (trip) {
                    verifyManagerTripOwner(req.headers['authorization'], trip.managerId)
                        .then((isSame) => {
                            if (isSame) {
                                if (trip.cancelled){
                                    res.status(422).send({ err: dict.get('AlreadyCancelled', lang) });
                                } else if (new Date(trip.start) <= Date()){
                                    res.status(414).send({ err: dict.get('PreconditionFailed', lang) });
                                } else {
                                    Applications.findOne({idTrip: trip._id, status: 'ACCEPTED'}, function(err,app){
                                        if (err) {
                                            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                                        } 
                                        else if (!app) {
                                            trip.cancelled = true;
                                            trip.reasonCancelling = reasonCancelling;
                                            trip.save(function(err2, newTrip) {
                                                if (err2) {
                                                    if(err2.name=='ValidationError') {
                                                        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                                                    }
                                                    else{
                                                        res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                                                    }
                                                } else {
                                                    cache.clear();
                                                    res.status(200).send(newTrip); // return the updated actor
                                                }
                                            });
                                        }
                                        else {
                                            res.status(414).send({ err: dict.get('PreconditionFailed', lang) });
                                        }
                                    });
                                }
                            } else {
                                res.status(401).send({ err: dict.get('Unauthorized', lang) });
                            }
                        })
                        .catch((error) => {
                            res.status(500).send(error);
                        });
                } else {
                    res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'trip', req.params.tripId) });
                }
            }
        });
    }
}

verifyManagerTripOwner = (token, idManager) => {
    return authController.getUserId(token)
    .then((idActor) => {
        if (idActor) {
            return (new String(idActor).valueOf() == new String(idManager).valueOf());
        }
        return false;
    })
    .catch((error) => {
        console.log(error);
        return false;
    })
}
