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
    Applications.find({}, function(err, applications) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        }
        else {
            res.status(200).json(applications);
        }
    });
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
            var new_application = new Applications(req.body);
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
    Applications.findById(req.params.applicationId, function(err, application) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!application) {
            res.status(404).json({ err: dict.get('RessourceNotFound', lang, 'application', req.params.applicationId) });
        }
        else {
            res.json(application);
        }
    })
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
 *                status:
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
        else if ((req.body.status == "ACCEPTED") && application.status != "DUE") {
            res.status(422).send({ err: dict.get('ErrorSchema', lang) });
        }
        else if ((req.body.status == "CANCELLED") && application.status != "ACCEPTED") {
            res.status(422).send({ err: dict.get('ErrorSchema', lang) });
        } 
        else {
            if (req.body.status == "ACCEPTED") {
                application.payedAt = Date.now();
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
}