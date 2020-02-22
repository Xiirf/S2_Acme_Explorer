var mongodb = require('mongodb')
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var Actors = mongoose.model('Actors');
var Trips = mongoose.model('Trips');

/**
 * @swagger
 *  components:
 *    schemas:
 *      sponsorship:
 *        allOf:
 *        - type: object
 *          properties:
 *            _id:
 *              type: string
 *            banner:
 *              type: array
 *              items:
 *                type: string
 *            link:
 *              type: string
 *            price:
 *              type: number
 *            payed:
 *              type: boolean
 *            sponsor_id:
 *              type: string
 *            trip_id:
 *              type: string
 *            created_at:
 *              type: string
 *            __v:
 *              type: integer
 */
var sponsorshipModel = new Schema({
    banner: {
        data: Buffer,
        contentType: String,
    }, link: {
        type: String,
        required: 'Enter the link to the sponsor site please'
    }, price: {
        type: Number,
        min: 0,
        required: 'Enter the price of the sponsorship please'
    }, payed: {
        type: Boolean,
        default: false
    }, sponsor_id: {
        type: mongodb.ObjectID,
        required: 'Enter the sponsor id of this sponsorship please',
        validate: {
            validator: async function(v) {
                return Promise.resolve(Actors.findById(v, function(err, actor) {
                    return actor && actor.role == "Sponsor";
                }));
            },
            message: "There are no sponsor with this id"
        }
    }, trip_id: {
        type: mongodb.ObjectID,
        required: 'Enter the trip id of this sponsorship please',
        validate: {
            validator: async function(v) {
                return Promise.resolve(Trips.findById(v, function(err, trip) {
                    return trip != null;
                }));
            },
            message: "There are no trip with this id"
        }
    }, createdAt: {
        type:Date,
        default: Date.now
    }
}, {
    strict: false
})

sponsorshipModel.index( { sponsor_id: 1 } );
sponsorshipModel.index( { payed: -1 } );

module.exports = mongoose.model ('Sponsorships', sponsorshipModel);