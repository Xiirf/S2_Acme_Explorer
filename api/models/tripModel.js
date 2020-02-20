var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongodb = require('mongodb');
const generate = require('nanoid/generate');
const dateFormat = require('dateformat');
var mongoose = require('mongoose')
Actors = require('./actorModel');
Sponsorships = require('./sponsorshipModel');
Applications = require('./applicationModel');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Stage:
 *        type: object
 *        required:
 *          - title
 *          - description
 *          - price
 *        properties:
 *          title:
 *            type: string
 *            description: Stage title.
 *            example: 'testExample'
 *          description:
 *            type: string
 *            description: Stage description.
 *            example: 'descExample'
 *          price:
 *            type: number
 *            description: Stage price.
 *            example: 250
 *           
 */
var stageSchema = new Schema({
    title: {
        type: String,
        required: 'Enter the title of the stage please'
    }, description: {
        type: String,
        required: 'Enter the description of the stage please'
    }, price: {
        type: Number,
        required: 'Enter the price of the stage please',
        min: 0
    }
}, {strict: false});
module.exports = mongoose.model('Stages', stageSchema);
Stages = mongoose.model('Stages');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Trip:
 *        type: object
 *        required:
 *          - title
 *          - description
 *          - requirements
 *          - start
 *          - end
 *          - managerId
 *        properties:
 *          title:
 *            type: string
 *            description: Trip title.
 *            example: 'testExample'
 *          description:
 *            type: string
 *            description: Trip description.
 *            example: 'descTrip'
 *          requirements:
 *            type: array
 *            items: string
 *            description: Trip requirements.
 *            example: ["testReq"]
 *          start:
 *            type: Date
 *            description: Trip start date.
 *            example: 2020-02-14
 *          end:
 *            type: Date
 *            description: Trip end date.
 *            example: 2020-02-14
 *          pictures:
 *            type: array
 *            items: object
 *            properties:
 *              data:
 *                  type: Buffer
 *              contentType:
 *                  type: string
 *            description: Array of Trip pictures.
 *          stages:
 *            type: array
 *            items: object
 *            $ref: '#/components/schemas/Stage'
 *            description: Array of Trip pictures.
 *          managerId:
 *            type: mongodb.ObjectID
 *            description: ID of the trip manager.
 *            example: 5e46e51d9ae2103198416348
 *           
 */
var tripSchema = new Schema({
    //No es necesario hacer una verificación porque la generación es automática y 
    //la validación no funciona después del "pre.save".
    ticker: {
        type: String,
        unique: true,
        unmodifiable: true
    }, title: {
        type: String,
        required: 'Enter the title of the trip please'
    }, description: {
        type: String,
        required: 'Enter the description of the trip please'
    }, requirements: [{
        type: String,
        required: 'Enter the requirements of the trip please'
    }], start: {
        type: Date,
        required: 'Enter the start (date) of the trip please'
    }, end: {
        type: Date,
        required: 'Enter the end (date) of the trip please',
        validate: [dateValidator,
                    'Start Date must be less than End Date']
    }, pictures: [{
        data: Buffer,
        contentType: String
    }], price: {
        type: Number,
        default: 0,
        min: 0
    }, published: {
        type: Boolean,
        default: false
    },cancelled: {
        type: Boolean,
        default: false
    }, reasonCancelling: {
        type: String
    }, stages: [stageSchema],
    managerId: {
        type: mongodb.ObjectID,
        required: 'Enter the manager ID of the trip please',
        validate: {
            validator: async function(v) {
                return Promise.resolve(Actors.findById(v, function(err, actor) {
                    return actor && actor.role == "Manager";
                }));
            },
            message: "There are no manager with this id"
        }
    }
}, {strict: true, toJSON: {virtuals: true}});

function dateValidator(value) {
    return this.start <= value;
}

tripSchema.pre('save', function(callback) {
    var new_trip = this;

    // Break out if the cancelled hasn't changed
    if (!new_trip.ticker) {
        // Generación del Ticker
        var date=dateFormat(new Date(), "yymmdd");
        var generated_ticker = [date, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
        new_trip.ticker = generated_ticker;
    }
    // Price
    var price = 0;
    new_trip.stages.forEach(stage => {
        price += stage.price;
    })
    new_trip.price = price;

    callback();
});

tripSchema.pre('deleteOne', async function(callback){
    //Delete all object associated with this trip
    var tripId = this._conditions._id;
    await Sponsorships.deleteMany({trip_id: tripId} ,(err) => {
        if(err) throw err;
    });
    await Applications.deleteMany({idTrip: tripId} ,(err) => {
        if(err) throw err;
    });

    callback();
});

tripSchema.index( { title: "text", description: "text", ticker: "text" } );
tripSchema.index( { ticker: "text", published: 1, cancelled: -1 } );
tripSchema.index( { price: 1, published: 1, cancelled: -1 } );
tripSchema.index( { start: 1, published: 1, cancelled: -1 } );
tripSchema.index( { end: 1, published: 1, cancelled: -1 } );
tripSchema.index( { ManagerId: 1} );

module.exports = mongoose.model('Trips', tripSchema);