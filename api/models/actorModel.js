var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var actorModel = new Schema({
    name: {
        type: String,
        required: 'Enter the name of the actor please'
    }, surname: {
        type: String,
        required: 'Enter the surname of the actor please'
    }, email: {
        type: String,
        required: 'Enter the email of the actor please'
    }, password: {
        type: String,
        required: 'Enter the password of the actor please'
    }, adress: {
        type: String,
        required: 'Enter the address of the actor please'
    }, phone: {
        type: String,
        required: 'Enter the phone of the actor please'
    }, role: {
        type: String,
        required: 'Enter the role(s) of the actor please',
        enum: ['Administrator', 'Manager', 'Explorer', 'Sponsor']
    }, createdAt: {
        type:Date,
        default: Date.now
    }
}, {
    strict: false
})

module.exports = mongoose.model ('Actors', actorModel);