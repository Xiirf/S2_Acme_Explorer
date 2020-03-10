'use strict';

/**
 * @swagger
 * tags:
 *   name: Finders
 *   description: Finders organize
 */
var mongoose = require('mongoose'),
Finders = mongoose.model('Finders');
var authController = require('./authController');
var LangDictionnary = require('../../langDictionnary');
var dict = new LangDictionnary();

/**
 * @swagger
 * path:
 *  /finders:
 *    get:
 *      summary: Get all finders
 *      tags: [Finders]
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      responses:
 *        "200":
 *          description: Return all finders
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Finders'
 *        "500":
 *          description: Internal error
 */
exports.list_all_finders = function(req, res) {
    var lang = dict.getLang(req);
    var token = req.headers['authorization'];

    authController.getUserId(token)
        .then((explorerId) => {
            Finders.find({idExplorer: explorerId}, function(err, finders) {
                if (err) {
                    res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                }
                else {
                    res.status(200).json(finders);
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
 *  /finders:
 *    post:
 *      summary: Create an finder
 *      tags: [Finders]
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Finders'
 *      responses:
 *        "201":
 *          description: Finder created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Finders'
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Server error
 */
exports.create_a_finder = function(req, res) {
    var lang = dict.getLang(req);
    var new_finder = new Finders(req.body);
    new_finder.save(function(err, finder) {
        if (err) {
            if (err.name=='ValidationError') {
                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
            }
            else{
                res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
            }
        }
        else {
            res.status(201).json(finder);
        }
    });
}

/**
 * @swagger
 * path:
 *  /finders/{finderId}:
 *    get:
 *      summary: Get a finder
 *      tags: [Finders]
 *      parameters:
 *         - name: finderId
 *           in: path
 *           description: finder Id
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      responses:
 *        "200":
 *          description: Return a finder
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Finders'
 *        "404":
 *          description: Ressource not found
 *        "500":
 *          description: Internal error
 */
exports.read_a_finder = function(req, res) {
    var lang = dict.getLang(req);
    Finders.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!finder) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'finder', req.params.finderId) });
        }
        else {
            verifyExplorerApplicationOwner(req.headers['authorization'], application.idExplorer)
                .then((isSame) => {
                    if (isSame) {
                        res.json(finder);
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
 *  /finders/{finderId}:
 *    put:
 *      summary: Edit a finder
 *      tags: [Finders]
 *      parameters:
 *         - name: finderId
 *           in: path
 *           description: finder Id
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Finders'
 *      responses:
 *        "200":
 *          description: Finder updated
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Finders'
 *        "404":
 *          description: Ressource not found
 *        "422":
 *          description: Validation Error
 *        "500":
 *          description: Internal error
 */
exports.edit_a_finder = function(req, res) {
    var lang = dict.getLang(req);

    Finders.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!finder) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'finder', req.params.finderId) });
        }
        else {
            verifyExplorerFinderOwner(req.headers['authorization'], finder.idExplorer)
                .then((isSame) => {
                    if (isSame) {
                        Finders.findOneAndUpdate({_id: req.params.finderId}, req.body, {new:true, runValidators: true}, function(err, finder) {
                            if (err) {
                                if (err.name=='ValidationError') {
                                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                                }
                                else {
                                  res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                                }
                            } 
                            else if (!finder) {
                                res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'finder', req.params.finderId) });
                            } 
                            else {
                                res.status(200).json(finder);
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
    })
}

/**
 * @swagger
 * path:
 *  /finders/{finderId}:
 *    delete:
 *      summary: Delete a finder
 *      tags: [Finders]
 *      parameters:
 *         - name: finderId
 *           in: path
 *           description: finder Id
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      responses:
 *        "200":
 *          description: Item delete msg
 *        "500":
 *          description: Internal error
 */
exports.delete_a_finder = function(req, res) {
    var lang = dict.getLang(req);
    var id = req.params.finderId
    Finders.findOneAndDelete({"_id": id}, null, function(err, finder) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorDeleteDB', lang) });
        } 
        else {
            res.sendStatus(204);
        }
    })
}

async function verifyExplorerFinderOwner(token, idExplorer) {
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