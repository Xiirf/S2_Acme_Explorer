'use strict';

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Applications organize
 */
var mongoose = require('mongoose'),
Applications = mongoose.model('Applications'),
Trips = mongoose.model('Trips');
var authController = require('./authController');
var LangDictionnary = require('../../langDictionnary');
var dict = new LangDictionnary();

/**
 * @swagger
 * path:
 *  /applications:
 *    get:
 *      summary: Get all applications
 *      tags: [Applications]
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      responses:
 *        "200":
 *          description: Return all applications
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Applications'
 *        "500":
 *          description: Internal error
 */
exports.list_all_applications = function(req, res) {
    var lang = dict.getLang(req);
    var token = req.headers['authorization'];

    authController.getUserRoleAndId(token)
        .then((actor) => {
            if (actor.role == "Manager") {
                Trips.find({managerId: actor.id}, '_id', function(err, trips) {
                    if (err) {
                        res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                    }
                    else {
                        var tripsId = [];
                        trips.forEach(trip => tripsId.push(trip._id));
                        Applications.find({idTrip: {$in: tripsId}})
                            .sort({status: -1})
                            .exec(function(err, applications) {
                                if (err) {
                                    res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                                }
                                else {
                                    res.status(200).json(applications);
                                }
                            });
                    }
                });
            }
            else {
                Applications.find({idExplorer: actor.id}, function(err, applications) {
                    if (err) {
                        res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                    }
                    else {
                        res.status(200).json(applications);
                    }
                });
            }
        })
        .catch((err) => {
            res.status(500).send(err);
        })
    
}

/**
 * @swagger
 * path:
 *  /applications:
 *    post:
 *      summary: Create an Application
 *      tags: [Applications]
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Applications'
 *      responses:
 *        "201":
 *          description: Application created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Applications'
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Server error
 */
exports.create_an_application = function(req, res) {
    var lang = dict.getLang(req);
    var token = req.headers['authorization'];

    Trips.findById({_id: req.body.idTrip}, function(err, trip) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!trip) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'trip', req.body.idTrip) });
        }
        else if (!trip.published || trip.cancelled || trip.start < Date.now) {
            res.status(422).send({ err: dict.get('ErrorSchema', lang) });
        }
        else {
            authController.getUserId(token)
                .then((explorerId) => {
                    var new_application = new Applications(req.body);
                    new_application.idExplorer = explorerId;
                    new_application.status = "PENDING";
                    new_application.reasonRejected = null;
                    new_application.save(function(err, application) {
                        if (err) {
                            if(err.name=='ValidationError') {
                                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                            }
                            else{
                                res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
                            }
                        }
                        else {
                            res.status(201).json(application);
                        }
                    });
                })
                .catch((err) => {
                    res.status(500).send(err);
                })
        }
    });
}

/**
 * @swagger
 * path:
 *  /applications/{applicationId}:
 *    get:
 *      summary: Get an application
 *      tags: [Applications]
 *      parameters:
 *         - name: applicationId
 *           in: path
 *           description: application Id
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      responses:
 *        "200":
 *          description: Return an application
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Applications'
 *        "404":
 *          description: Ressource not found
 *        "500":
 *          description: Internal error
 */
exports.read_an_application = function(req, res) {
    var lang = dict.getLang(req);
    var token = req.headers['authorization'];

    authController.getUserRoleAndId(token)
        .then((actor) => {
            if (actor.role == "Manager") {
                Applications.findById(req.params.applicationId, function(err, application) {
                    if (err) {
                        res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                    } 
                    else if (!application) {
                        res.status(404).json({ err: dict.get('RessourceNotFound', lang, 'application', req.params.applicationId) });
                    }
                    else {
                        Trips.findById(application.idTrip, function(err, trip) {
                            if (err) {
                                res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                            }
                            else if (actor.id != trip.managerId){
                                res.status(401).send({ err: dict.get('Unauthorized', lang) });
                            }
                            else {
                                res.json(application);
                            }
                        });
                    }
                })
            }
            else {
                Applications.findById(req.params.applicationId, function(err, application) {
                    if (err) {
                        res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                    } 
                    else if (!application) {
                        res.status(404).json({ err: dict.get('RessourceNotFound', lang, 'application', req.params.applicationId) });
                    }
                    else if (application.explorerId  != actor.id){
                        res.status(401).send({ err: dict.get('Unauthorized', lang) });
                    }
                    else {
                        res.json(application);
                    }
                })
            }
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

/**
 * @swagger
 * path:
 *  /applications/{applicationId}:
 *    put:
 *      summary: Edit an application
 *      tags: [Applications]
 *      parameters:
 *         - name: applicationId
 *           in: path
 *           description: application Id
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Applications'
 *      responses:
 *        "200":
 *          description: Application updated
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Applications'
 *        "404":
 *          description: Ressource not found
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Internal error
 */
exports.edit_an_application = function(req, res) {
    var lang = dict.getLang(req);
    delete req.body.status;
    delete req.body.reasonRejected;
    Applications.findById({_id: req.params.applicationId}, function(err, application) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!application) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'application', req.params.applicationId) });
        }
        else {
            verifyExplorerApplicationOwner(req.headers['authorization'], application.idExplorer)
                .then((isSame) => {
                    if (isSame) {
                        Applications.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new:true, runValidators: true}, function(err, application) {
                            if (err) {
                                if (err.name=='ValidationError') {
                                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                                }
                                else{
                                res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                                }
                            } 
                            else if (!application) {
                                res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'application', req.params.applicationId) });
                            } 
                            else {
                                res.status(200).json(application);
                            }
                        })
                    }
                    else {
                        res.status(401).send({ err: dict.get('Unauthorized', lang) });
                    }
                })
                .catch((error) => {
                    res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                });
        }
    });
}

/**
 * @swagger
 * path:
 *  /applications/{applicationId}:
 *    delete:
 *      summary: Delete an application
 *      tags: [Applications]
 *      parameters:
 *         - name: applicationId
 *           in: path
 *           description: application Id
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      responses:
 *        "204":
 *          description: Item delete msg
 *        "500":
 *          description: Internal error
 */
exports.delete_an_application = function(req, res) {
    var lang = dict.getLang(req);
    Applications.findOneAndDelete({_id: req.params.applicationId}, function(err, application) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorDeleteDB', lang) });
        } else {
            res.sendStatus(204);
        }
    })
}

/**
 * @swagger
 * path:
 *  '/applications/{applicationId}/status':
 *    patch:
 *      summary: Edit the status of an application
 *      tags: [Applications]
 *      parameters:
 *         - name: applicationId
 *           in: path
 *           description: od of the application you want to modify
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
 *                - status
 *              properties:
 *                banned:
 *                  type: string
 *      responses:
 *        '200':
 *          description: Updated application
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/Applications'
 *        '404':
 *           description: Application not found
 *           content: Not Found
 *        '422':
 *           description: Incorrect body
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.edit_status_of_an_application = function(req, res) {
    var lang = dict.getLang(req);
    var token = req.headers['authorization'];

    authController.getUserRoleAndId(token)
        .then((actor) => {
            Applications.findById({_id: req.params.applicationId}, function(err, application) {
                if (err) {
                    res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                }
                else if (!application) {
                    res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'application', req.params.applicationId) });
                }
                else if ((req.body.status == "REJECTED" || req.body.status == "DUE") && application.status != "PENDING") {
                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                }
                else if (req.body.status == "ACCEPTED" && application.status != "DUE") {
                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                }
                else if (req.body.status == "CANCELLED" && (application.status != "ACCEPTED" || application.status != "PENDING")) {
                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                }
                else if ((req.body.status == "REJECTED" || req.body.status == "DUE") && actor.role != "Manager") {
                    res.status(401).send({ err: dict.get('Unauthorized', lang) });
                }
                else if (req.body.status == "CANCELLED" && actor.role != "Explorer") {
                    res.status(401).send({ err: dict.get('Unauthorized', lang) });
                }
                else {
                    if (req.body.status == "ACCEPTED") {
                        application.payedAt = Date.now();
                    }
                    if (req.body.status == "REJECTED") {
                        if(req.body.reasonRejected == null) {
                            res.status(422).send({ err: dict.get('MissingParameter', lang, 'reasonRejected') });
                        }
                        else {
                            application.reasonRejected = req.body.reasonRejected;
                        }
                    }
                    application.status = req.body.status;
                    application.save(function(err, application) {
                        if (err) {
                            if (err.name=='ValidationError') {
                                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                            }
                            else{
                                res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                            }
                        } 
                        else if (!application) {
                            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'application', req.params.applicationId) });
                        }
                        else {
                            res.status(200).json(application);
                        }
                    })
                }
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        })
    
}

async function verifyExplorerApplicationOwner(token, idExplorer) {
    return authController.getUserId(token)
        .then((idActor) => {
            if (idActor) {
                return (new String(idActor).valueOf() == new String(idExplorer).valueOf());
            }
            return false;
        })
        .catch((error) => {
            console.log(error);
            return false;
        })
}