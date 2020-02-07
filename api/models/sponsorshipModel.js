var mongodb = require('mongodb')
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var Actor = mongoose.model('Actors');

var sponsorshipModel = new Schema({
    banner: {
        data: Buffer,
        contentType: String,
    }, link: {
        type: String,
        required: 'Enter the link to the sponsor site please'
    }, price: {
        type: Number,
        required: 'Enter the price of the sponsorship please'
    }, payed: {
        type: Boolean,
        default: false
    }, sponsorId: {
        type: mongodb.ObjectID,
        required: 'Enter the sponsor id of this sponsorship please'
    }, tripId: {
        type: mongodb.ObjectID,
        required: 'Enter the trip id of this sponsorship please'
    }, createdAt: {
        type:Date,
        default: Date.now
    }
}, {
    strict: false
})

module.exports = mongoose.model ('Sponsorships', sponsorshipModel);