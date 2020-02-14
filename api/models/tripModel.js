var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongodb = require('mongodb');
const generate = require('nanoid/generate');
const dateFormat = require('dateformat');
//Après merge
//var mongoose = require('mongoose')
//Actors = mongoose.model('Actors');

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
    }], cancelled: {
        type: Boolean,
        default: false
    }, reasonCancelling: {
        type: String
    }, stages: [stageSchema],
    managerId: {
        type: mongodb.ObjectID,
        required: 'Enter the manager ID of the trip please'
        //Ajouter une fois merge
        /*validate: {
            validator: async function(v) {
                return Promise.resolve(Actors.findById(v, function(err, actor) {
                    return actor && actor.role == "Manager";
                }));
            },
            message: "There are no manager with this id"
        }*/
    }
}, {strict: true, toJSON: {virtuals: true}});

tripSchema.virtual('price').get(function() {
    var price = 0;
    this.stages.forEach(stage => {
        price += stage.price;
    })
    return price;
});

function dateValidator(value) {
    return this.start <= value;
}

tripSchema.pre('save', function(callback) {
    var new_trip = this;

    // Generación del Ticker
    var date=dateFormat(new Date(), "yymmdd");
    var generated_ticker = [date, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
    new_trip.ticker = generated_ticker;

    callback();
});

module.exports = mongoose.model('Stages', stageSchema);
module.exports = mongoose.model('Trips', tripSchema);