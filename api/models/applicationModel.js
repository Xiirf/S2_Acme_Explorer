var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Après merge
//var mongoose = require('mongoose')
//Actors = mongoose.model('Actors');
//Trips = mongoose.model('Trips');


/**
 * @swagger
 *  components:
 *    schemas:
 *      Applications:
 *        type: object
 *        required:
 *          - idExplorer
 *          - idTrip
 *        properties:
 *          idExplorer:
 *            type: mongodb.ObjectID
 *            description: Id of the explorer.
 *            example: 5e46e51d9ae2103198416348
 *          idTrip:
 *            type: mongodb.ObjectID
 *            description: Id of the trip.
 *            example: 5e46e51d9ae2103198416348
 *          createdAt:
 *            type: Date
 *            description: Date of the creation.
 *            example: 2020-02-14
 *          status:
 *            type: String
 *            description: Status of the application.
 *            example: 'PENDING'
 *          comments:
 *            type: array
 *            items: String
 *            description: Comments of the explorer.
 *            example: ['A comment', 'Another comment']
 *          reasonCancelling:
 *            type: String
 *            description: Reason why the application was cancelled.
 *            example: 'PENDING'
 */
var applicationSchema = new Schema({
    idExplorer: {
        type: mongodb.ObjectID,
        required: 'Kindly enter the idExplorer of the application',
        //Ajouter une fois merge
        /*validate: {
            validator: async function(v) {
                return Promise.resolve(Actors.findById(v, function(err, actor) {
                    return actor && actor.role == "Explorer";
                }));
            },
            message: "There are no explorer with this id"
        }*/
    },
    idTrip: {
        type: mongodb.ObjectID,
        required: 'Kindly enter the idTrip of the application',
        //Ajouter une fois merge
        /*validate: {
            validator: async function(v) {
                return Promise.resolve(Trips.findById(v, function(err, trip) {
                    return trip;
                }));
            },
            message: "There are no trip with this id"
        }*/
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'PENDING',
        enum: ['REJECTED', 'PENDING', 'DUE', 'ACCEPTED', 'CANCELLED']
    },
    comments: {
        type: [String]
    },
    reasonCancelling: {
        type: String,
        validate: [reasonValidator,
            'The application must be cancelled']
    }
}, {strict:false});

function reasonValidator(value) {
    return this.status == 'CANCELLED';
}

module.exports = mongoose.model('Applications', applicationSchema);