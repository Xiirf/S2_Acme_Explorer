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
    console.log(req.body);
    var stage = new Stages(req.body)
    console.log("ok")
    Trips.findOneAndUpdate({_id: req.params.tripId}, {$push: {stages: stage}}, {new:true, runValidators: true}, function(err, trip) {
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
                console.log(err);
              res.status(500).send(err);
            }
        } else if (!trip) {
            res.status(404)
                .json({ error: 'No se ha encontrado la ID.'});
        } else {
            res.json(trip);
        }
    })
}
