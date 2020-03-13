var mongoose = require('mongoose')
Sponsorships = mongoose.model('Sponsorships');
GlobalVars = mongoose.model('GlobalVars');
var auth = require('./authController');
var LangDictionnary = require('../../langDictionnary');
dict = new LangDictionnary();

 /**
 * @swagger
 * path:
 *  '/sponsorships':
 *    get:
 *      tags:
 *        - Sponsorship
 *      description: >-
 *        Retrieve all the sponsorships
 *      operationId: getSponsorships
 *      parameters:
 *        - name: tripId
 *          in: query
 *          description: Id of the trip that you wanna retrieve the sponsorships from
 *          required: false
 *          schema:
 *            type: string
 *        - name: payed
 *          in: query
 *          description: Wheter you want to display the sponsorships that are payed or the ones that ain't
 *          required: false
 *          schema:
 *            type: boolean
 *        - $ref: '#/components/parameters/language'
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - type: array
 *                  items:
 *                    $ref: '#/components/schemas/sponsorship'
 *        '500':
 *           description: Internal server error
 *           content: {}
 */

exports.list_all_sponsorships = function(req, res) {
    var filters = {}    
    if(req.query.tripId) filters.trip_id = req.query.tripId;
    if(req.query.payed != null) filters.payed = req.query.payed; 
    var lang = dict.getLang(req);
    Sponsorships.find(filters, function(err, sponsorships) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } else {
            res.json(sponsorships);
        }
    })
}

/**
 * @swagger
 * path:
 *  '/sponsorships':
 *    post:
 *      tags:
 *        - Sponsorship
 *      description: >-
 *        Create a new sponsorship
 *      operationId: postSponsorships
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - banner
 *                - link
 *                - trip_id
 *              properties:
 *                banner:
 *                  type: array
 *                  items:
 *                    type: string
 *                link:
 *                  type: string
 *                price:
 *                  type: number
 *                sponsor_id:
 *                  type: string
 *                trip_id:
 *                  type: string
 *      responses:
 *        '201':
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/sponsorship'
 *        '422':
 *           description: Unprocesable entity
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.create_a_sponsorship = function(req, res) {
    auth.verifyUser(['Sponsor'])(req, res, (error, actor) => {
        var new_sponsorship = new Sponsorships(req.body);
        new_sponsorship.sponsorId = actor._id;
        var lang = dict.getLang(req);
        new_sponsorship.save(function(err, sponsorship) {
            if(err) {
                if(err.name=='ValidationError') {
                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                }
                else{
                    console.error('Error getting data from DB');
                    res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
                }
            } else {
                res.status(201);
                res.send(sponsorship);
            }
        });
    });
}

/**
 * @swagger
 * path:
 *  '/sponsorships/{sponsorshipId}':
 *    get:
 *      tags:
 *        - Sponsorship
 *      description: >-
 *        Retrieve details from a specific sponsorship
 *      operationId: getSponsorship
 *      parameters:
 *        - name: sponsorshipId
 *          in: path
 *          description: id of the sponsorship you want to get details from
 *          required: true
 *          schema:
 *            type: string
 *        - $ref: '#/components/parameters/language'
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/sponsorship'
 *        '404':
 *           description: Sponsorship not found
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.read_a_sponsorship = function(req, res) {
    auth.verifyUser(['Sponsor'])(req, res, (error, actor) => {
        var id = req.params.sponsorshipId;
        var lang = dict.getLang(req);
        Sponsorships.findById(id, function (err, sponsorship) {
            if (err) {
                console.error('Error getting data from DB');
                res.status(500).send({ err: dict.get('ErrorGetDB', lang) }); // internal server error
            } else {
                if (sponsorship) {
                    if(sponsorship.sponsorId != actor._id) {
                        res.status(401).send({ err: dict.get('Unauthorized', lang) })
                        return;
                    }
                    res.send(sponsorship);
                } else {
                    console.warn("There are no sponsorship with id " + id);
                    res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', id) }); // not found
                }
            }
        });
    });
}

/**
 * @swagger
 * path:
 *  '/sponsorships/{sponsorshipId}':
 *    put:
 *      tags:
 *        - Sponsorship
 *      description: >-
 *        Update a specific sponsorship
 *      operationId: putSponsorship
 *      parameters:
 *        - name: sponsorshipId
 *          in: path
 *          description: id of the sponsorship you want to update
 *          required: true
 *          schema:
 *            type: string
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/sponsorship'
 *      responses:
 *        '200':
 *          description: Updated sponsorship
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/sponsorship'
 *        '400':
 *           description: Missing sponsorshipid parameter
 *           content: {}
 *        '404':
 *           description: Sponsorship not found
 *           content: {}
 *        '422':
 *           description: Unprocesable entity
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.edit_a_sponsorship = function(req, res) {
    auth.verifyUser(['Sponsor'])(req, res, (error, actor) => {
        var updatedSponsorship = req.body;
        var id = req.params.sponsorshipId;
        var lang = dict.getLang(req);
        if (!updatedSponsorship) {
            console.warn("New PUT request to /sponsorships/ without sponsorship, sending 400...");
            res.status(400).send({ err: dict.get('MissingBody', lang, 'sponsorship') }); // bad request
        } else {
            console.info("New PUT request to /sponsorships/" + id + " with data " + JSON.stringify(updatedSponsorship, 2, null));
            Sponsorships.findById(id, function(err, sponsorship) {
                if (err) {
                    console.error('Error getting data from DB');
                    res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
                } else {
                    if (sponsorship) {
                        if(sponsorship.sponsorId != actor._id) {
                            res.status(401).send({ err: dict.get('Unauthorized', lang) })
                            return;
                        }
                        sponsorship = Object.assign(sponsorship, updatedSponsorship);
                        sponsorship.save(function(err2, newSponsorship) {
                            if (err2) {
                                if(err2.name=='ValidationError') {
                                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                                }
                                else{
                                    console.error('Error updating data from DB');
                                    res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                                }
                            } else {
                                res.send(newSponsorship); // return the updated sponsorship
                            }
                        });
                    } else {
                        console.warn("There are not any sponsorship with id " + id);
                        res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', id) }); // not found
                    }
                }
            });
        }
    });
}

/**
 * @swagger
 * path:
 *  '/sponsorships/{sponsorshipId}/pay':
 *    patch:
 *      tags:
 *        - Sponsorship
 *      description: >-
 *        Pay or set to unpayed a sponsorship
 *      operationId: patchSponsorshipPayement
 *      parameters:
 *        - name: sponsorshipId
 *          in: path
 *          description: id of the sponsorship you want to ban or unban
 *          required: true
 *          schema:
 *            type: string
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - payed
 *              properties:
 *                payed:
 *                  type: boolean
 *      responses:
 *        '200':
 *          description: Updated sponsorship
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/sponsorship'
 *        '404':
 *           description: Sponsorship not found
 *           content: {}
 *        '422':
 *           description: Incorrect body
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.handle_sponsorship_payement = function(req, res) {
    auth.verifyUser(['Sponsor'])(req, res, (error, actor) => {
        var payed = req.body ? req.body.payed : undefined;
        var id = req.params.sponsorshipId;
        var lang = dict.getLang(req);
        if (!payed || typeof(payed) != "boolean") {
            console.warn("New PATCH request to /sponsorships/id/pay without correct attribute payed, sending 400...");
            res.status(422).send({ err: dict.get('ErrorSchema', lang) });
        } else {
            Sponsorships.findOneAndUpdate({"_id": id}, { "payed": payed }, { new: true }, function(err, sponsorship) {
                if (err) {
                    if(err.name=='ValidationError') {
                        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                    }
                    else {
                        console.error('Error getting data from DB');
                        res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                    }
                } else {
                    if (sponsorship) {
                        if(sponsorship.sponsorId != actor._id) {
                            res.status(401).send({ err: dict.get('Unauthorized', lang) })
                            return;
                        }
                        res.send(sponsorship); // return the updated sponsorship
                    } else {
                        console.warn("There are not any sponsorship with id " + id);
                        res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', id) }); // not found
                    }
                }
            });
        }
    });
}

/**
 * @swagger
 * path:
 *  '/sponsorships/flatRate':
 *    patch:
 *      tags:
 *        - Sponsorship
 *        - GlobalVars
 *      description: >-
 *       fix flat rate for all sponsorships
 *      operationId: patchSponsorshipsFlatRate
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - flatRateSponsorships
 *              properties:
 *                flatRateSponsorships:
 *                  type: number
 *                  format: float
 *      responses:
 *        '204':
 *          description: Flat rate successfully changed
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/GlobalVars'
 *        '422':
 *           description: Incorrect body
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.handle_flat_rate_change = function(req, res) {
    var flatRateSponsorships = req.body ? req.body.flatRateSponsorships : undefined;
    var lang = dict.getLang(req);
    if ((flatRateSponsorships !== 0 && !flatRateSponsorships) || typeof(flatRateSponsorships) != "number") {
        console.warn("New PATCH request to /sponsorships/flatRate without correct attribute flatRateSponsorships, sending 400...");
        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
    } else {
        GlobalVars.findOneAndUpdate({}, { "flatRateSponsorships": flatRateSponsorships }, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }, function(err, globalVars) {
            if (err) {
                if(err.name=='ValidationError') {
                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                }
                else{
                    console.error('Error getting data from DB');
                    res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                }
            } else {
                res.status(200).send(globalVars);
            }
        });
    }
}

/**
 * @swagger
 * path:
 *  '/sponsorships/{sponsorshipId}':
 *    delete:
 *      tags:
 *        - Sponsorship
 *      description: >-
 *        Delete a specific sponsorship
 *      operationId: deleteSponsorship
 *      parameters:
 *        - name: sponsorshipId
 *          in: path
 *          description: id of the sponsorship you want to delete
 *          required: true
 *          schema:
 *            type: string
 *        - $ref: '#/components/parameters/language'
 *      responses:
 *        '204':
 *          description: No content
 *          content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.delete_a_sponsorship = function(req, res) {
    auth.verifyUser(['Sponsor'])(req, res, (error, actor) => {
        var id = req.params.sponsorshipId;
        var lang = dict.getLang(req);
        Sponsorships.findOneAndDelete({"_id": id}, null, function (err) {
            if (err) {
                console.error('Error removing data from DB');
                res.status(500).send({ err: dict.get('ErrorDeleteDB', lang) }); // internal server error
            } else {
                res.sendStatus(204); // no content
            }
        });
    });
}
