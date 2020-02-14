var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongodb = require('mongodb');
const generate = require('nanoid/generate');
const dateFormat = require('dateformat');

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

var tripModel = new Schema({
    ticker: { // Attention au match patern
        type: String,
        required: 'Enter the ticker of the trip please',
        unique: true
    }, title: {
        type: String,
        required: 'Enter the title of the trip please'
    }, description: {
        type: String,
        required: 'Enter the description of the trip please'
    }, price: {
        type: Number,
        required: 'Enter the price of the trip please',
        min: 0
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
    }, stagesId: [stageSchema],
    managerId: {
        type: mongodb.ObjectID,
        required: 'Enter the manager ID of the trip please'
    }
}, {strict: false});

function dateValidator(value) {
    return this.start <= value;
}

tripModel.pre('save', function(callback) {
    var new_trip = this;

    // Generación del Ticker
    var date=dateFormat(new Date(), "yymmdd");
    var generated_ticker = [date, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-')
    new_trip.ticker = generated_ticker;

    // Cálculo del precio
    new_trip.stagesId.forEach(stagesId => {
        
    });

    callback();
});

module.exports = mongoose.model('Trips', tripModel);