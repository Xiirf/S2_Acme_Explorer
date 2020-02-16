var mongoose = require('mongoose')
Sponsorships = mongoose.model('Sponsorships');

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
    Sponsorships.find({}, function(err, sponsorships) {
        if(err) {
            res.status(500).send(err);
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
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - banner
 *                - link
 *                - price
 *                - sponsor_id
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
    var new_sponsorship = new Sponsorships(req.body);
    new_sponsorship.save(function(err, sponsorship) {
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
            res.send(sponsorship);
        }
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
 *         - name: sponsorshipId
 *           in: path
 *           description: id of the sponsorship you want to get details from
 *           required: true
 *           schema:
 *             type: string
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
    var id = req.params.sponsorshipId;
    Sponsorships.findById(id, function (err, sponsorship) {
        if (err) {
          console.error('Error getting data from DB');
          res.status(500).send(err); // internal server error
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
 *         - name: sponsorshipId
 *           in: path
 *           description: id of the sponsorship you want to update
 *           required: true
 *           schema:
 *             type: string
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
    var updatedSponsorship = req.body;
    var id = req.params.sponsorshipId;
    if (!updatedSponsorship) {
        console.warn("New PUT request to /sponsorships/ without sponsorship, sending 400...");
        res.sendStatus(400); // bad request
    } else {
        console.info("New PUT request to /sponsorships/" + id + " with data " + JSON.stringify(updatedSponsorship, 2, null));
        Sponsorships.findById(id, function(err, sponsorship) {
            if (err) {
                console.error('Error getting data from DB');
                res.status(500).send(err);
            } else {
                if (sponsorship) {
                    sponsorship = Object.assign(sponsorship, updatedSponsorship);
                    sponsorship.save(function(err2, newSponsorship) {
                        if (err2) {
                            if(err.name=='ValidationError') {
                                res.status(422).send(err2);
                            }
                            else{
                                console.error('Error getting data from DB');
                                res.status(500).send(err2);
                            }
                        } else {
                            res.send(newSponsorship); // return the updated sponsorship
                        }
                    });
                } else {
                    console.warn("There are not any sponsorship with id " + id);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
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
 *         - name: sponsorshipId
 *           in: path
 *           description: id of the sponsorship you want to ban or unban
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
 *           content: Not Found
 *        '422':
 *           description: Incorrect body
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.handle_sponsorship_payement = function(req, res) {
    var payedObject = req.body;
    var id = req.params.sponsorshipId;
    if (!payedObject || typeof(payedObject.payed) != "boolean") {
        console.warn("New PATCH request to /sponsorships/id/pay without correct attribute payed, sending 400...");
        res.sendStatus(400);
    } else {
        console.info("New PATCH request to /sponsorships/" + id + "/pay with value " + JSON.stringify(payedObject.payed, 2, null));
        Sponsorships.findOneAndUpdate({"_id": id}, payedObject, { new: true }, function(err, sponsorship) {
            if (err) {
                if(err.name=='ValidationError') {
                    res.status(422).send(err);
                }
                else{
                    console.error('Error getting data from DB');
                    res.status(500).send(err);
                }
            } else {
                if (sponsorship) {
                    res.send(sponsorship); // return the updated sponsorship
                } else {
                    console.warn("There are not any sponsorship with id " + id);
                    res.sendStatus(404); // not found
                }
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
 *         - name: sponsorshipId
 *           in: path
 *           description: id of the sponsorship you want to delete
 *           required: true
 *           schema:
 *             type: string
 *      responses:
 *        '204':
 *          description: No content
 *          content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.delete_a_sponsorship = function(req, res) {
    var id = req.params.sponsorshipId;
    Sponsorships.findOneAndDelete({"_id": id}, null, function (err) {
      if (err) {
        console.error('Error removing data from DB');
        res.status(500).send(err); // internal server error
      } else {
        console.info("The sponsorship with id " + id + " has been succesfully deleted, sending 204...");
        res.sendStatus(204); // no content
      }
    });
}
