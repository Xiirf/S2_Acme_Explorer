var mongoose = require('mongoose')
var Schema = mongoose.Schema;
// TRIP?
var stageModel = new Schema({
    title: {
        type: String,
        required: 'Enter the title of the stage please'
    }, description: {
        type: String,
        required: 'Enter the description of the stage please'
    }, price: {
        type: Number,
        required: 'Enter the price of the stage please'
    }
}, {
    strict: false
})

module.exports = mongoose.model('Stages', stageModel);