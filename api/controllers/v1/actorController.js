/* actorController.js 
* 
* Actor API service
* 
* Authors: 
* Pierre-François Giraud
* 
* Universidad de Sevilla 
* 2019-20
* 
*/

var mongoose = require('mongoose')
Actors = mongoose.model('Actors');
var LangDictionnary = require('../../langDictionnary');
var dict = new LangDictionnary();

 /**
 * @swagger
 * path:
 *  '/actors':
 *    get:
 *      tags:
 *        - Actor
 *      description: >-
 *        Retrieve all the actors
 *      operationId: getActors
 *      parameters:
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
 *                    $ref: '#/components/schemas/actor'
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.list_all_actors = function(req, res) {
    var lang = dict.getLang(req);
    Actors.find({}, function(err, actors) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } else {
            res.json(actors);
        }
    })
}

/**
 * @swagger
 * path:
 *  '/actors':
 *    post:
 *      tags:
 *        - Actor
 *      description: >-
 *        Create a new actor
 *      operationId: postActors
 *      parameters:
 *        - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - surname
 *                - email
 *                - password
 *                - role
 *              properties:
 *                name:
 *                  type: string
 *                surname:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                phone:
 *                  type: string
 *                address:
 *                  type: string
 *                role:
 *                  type: string
 *                  enum: [Administrator, Manager, Explorer, Sponsor]
 *      responses:
 *        '201':
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/actor'
 *        '422':
 *           description: Unprocesable entity
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.create_an_actor = function(req, res) {
    var new_actor = new Actors(req.body);
    var lang = dict.getLang(req);
    new_actor.save(function(err, actor) {
        if(err) {
            if(err.name=='ValidationError') {
                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
            }
            else{
                console.error('Error create data in DB');
                res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
            }
        } else {
            res.status(201).send(actor);
        }
    });
}

/**
 * @swagger
 * path:
 *  '/actors/{actorId}':
 *    get:
 *      tags:
 *        - Actor
 *      description: >-
 *        Retrieve details from a specific actor
 *      operationId: getActor
 *      parameters:
 *         - name: actorId
 *           in: path
 *           description: id of the actor you want to get details from
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/actor'
 *        '404':
 *           description: Actor not found
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.read_an_actor = function(req, res) {
    var id = req.params.actorId;
    var lang = dict.getLang(req);
    Actors.findById(id, function (err, actor) {
        if (err) {
          console.error('Error getting data from DB');
          res.status(500).send({ err: dict.get('ErrorGetDB', lang) }); // internal server error
        } else {
          if (actor) {
            res.send(actor);
          } else {
            console.warn(dict.get('RessourceNotFound', lang, 'actor', id));
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', id) }); // not found
          }
        }
      });
}

/**
 * @swagger
 * path:
 *  '/actors/{actorId}':
 *    put:
 *      tags:
 *        - Actor
 *      description: >-
 *        Update a specific actor
 *      operationId: putActor
 *      parameters:
 *         - name: actorId
 *           in: path
 *           description: id of the actor you want to update
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/actor'
 *      responses:
 *        '200':
 *          description: Updated actor
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/actor'
 *        '404':
 *           description: Actor not found
 *           content: {}
 *        '422':
 *           description: Unprocesable entity
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.edit_an_actor = function(req, res) {
    var updatedActor = req.body;
    var id = req.params.actorId;
    var lang = dict.getLang(req);
    if (!updatedActor) {
        console.warn("New PUT request to /actors/ without actor, sending 400...");
        res.status(422).send({ err: dict.get('ErrorSchema', lang) }); // bad request
    } else {
        Actors.findById(id, function(err, actor) {
            if (err) {
                console.error('Error getting data from DB');
                res.status(500).send({ err: dict.get('ErrorGetDB', lang) }); // internal server error
              } else {
                if (actor) {
                    actor = Object.assign(actor, updatedActor)
                    actor.save(function(err2, newActor) {
                        if (err2) {
                            if(err2.name=='ValidationError') {
                                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                            }
                            else{
                                console.error('Error updating data from DB');
                                res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                            }
                        } else {
                            res.send(newActor); // return the updated actor
                        }
                    });
                    
                } else {
                  console.warn(dict.get('RessourceNotFound', lang, 'actor', id));
                  res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', id) }); // not found
                }
            }
        });
    }
}


/**
 * @swagger
 * path:
 *  '/actors/{actorId}/ban':
 *    patch:
 *      tags:
 *        - Actor
 *      description: >-
 *        Ban or unban an actor
 *      operationId: patchActorBanishment
 *      parameters:
 *         - name: actorId
 *           in: path
 *           description: id of the actor you want to ban or unban
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
 *                - banned
 *              properties:
 *                banned:
 *                  type: boolean
 *      responses:
 *        '200':
 *          description: Updated actor
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/actor'
 *        '404':
 *           description: Actor not found
 *           content: Not Found
 *        '422':
 *           description: Incorrect body
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.handle_actor_banishment = function(req, res) {
    var banned = req.body ? req.body.banned : undefined;
    var id = req.params.actorId;
    var lang = dict.getLang(req);
    if (!banned || typeof(banned) != "boolean") {
        console.warn("New PATCH request to /actors/id/ban without correct attribute banned, sending 422...");
        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
    } else {
        Actors.findOneAndUpdate({"_id": id}, { "banned": banned }, { new: true }, function(err, actor) {
            if (err) {
                console.error('Error getting data from DB');
                res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
            } else {
                if (actor) {
                    res.send(actor); // return the updated actor
                } else {
                    console.warn(dict.get('RessourceNotFound', lang, 'actor', id));
                    res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', id) });                }
            }
        });
    }
}

/**
 * @swagger
 * path:
 *  '/actors/{actorId}':
 *    delete:
 *      tags:
 *        - Actor
 *      description: >-
 *        Delete a specific actor
 *      operationId: deleteActor
 *      parameters:
 *         - name: actorId
 *           in: path
 *           description: id of the actor you want to delete
 *           required: true
 *           schema:
 *             type: string
 *         - $ref: '#/components/parameters/language'
 *      responses:
 *        '204':
 *          description: No content
 *          content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.delete_an_actor = function(req, res) {
    var id = req.params.actorId;
    var lang = dict.getLang(req);
    Actors.findOneAndDelete({"_id": id}, null, function (err) {
      if (err) {
        console.error('Error removing data from DB');
        res.status(500).send({ err: dict.get('ErrorDeleteDB', lang) }); // internal server error
      } else {
        res.sendStatus(204); // no content
      }
    });
}
