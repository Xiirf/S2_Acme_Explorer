'use strict';

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Applications organize
 */
var mongoose = require('mongoose'),
Applications = mongoose.model('Applications');

/**
 * @swagger
 * path:
 *  /applications:
 *    get:
 *      summary: Get all applications
 *      tags: [Applications]
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
    Applications.find({}, function(err, applications) {
        if (err) {
            res.status(500).send(err);
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
    var new_application = new Applications(req.body);
    new_application.save(function(err, application) {
        if (err) {
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
                res.status(500).send(err);
            }
        }
        else {
            res.status(201).json(application);
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
    Applications.findById(req.params.applicationId, function(err, application) {
        if (err) {
            res.status(500).send(err);
        } 
        else if (!application) {
            res.status(404).json({ error: 'No applications with this Id were found.'});
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
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Applications'
 *      responses:
 *        "200":
 *          description: Trip updated
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
exports.update_an_application = function(req, res) {
    Applications.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new:true, runValidators: true}, function(err, application) {
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
              res.status(500).send(err);
            }
        } else if (!trip) {
            res.status(404)
                .json({ error: 'No applications with this Id were found.'});
        } else {
            res.status(200).json(trip);
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
 *      responses:
 *        "200":
 *          description: Item delete msg
 *        "500":
 *          description: Internal error
 */
exports.delete_an_application = function(req, res) {
    Applications.findOneAndDelete({_id: req.params.applicationId}, function(err, application) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json({message: 'Application successfully deleted', application});
        }
    })
}