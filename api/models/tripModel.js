var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongodb = require('mongodb');

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
        required: 'Enter the price of the trip please'
    }, requirements: [{
        type: String,
        required: 'Enter the requirements of the trip please'
    }], start: {
        type: Date,
        required: 'Enter the start (date) of the trip please'
    }, end: {
        type: Date,
        required: 'Enter the end (date) of the trip please'
    }, pictures: [{
        data: Buffer,
        contentType: String
    }], cancelled: {
        type: Boolean,
        default: false
    }, reasonCancelling: {
        type: String
    }, stagesId: [{
        type: mongodb.ObjectID,
        required: 'Enter the stages of the trip please'
    }], managerId: {
        type: String,
        required: 'Enter the manager ID of the trip please'
    }
}, {
    strict: false
})

module.exports = mongoose.model('Trips', tripModel);