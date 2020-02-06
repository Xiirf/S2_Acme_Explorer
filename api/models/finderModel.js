var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var finderSchema = new Schema({
    idExplorer: {
        type: String,
        required: 'Kindly enter the idExplorer of the finder'
    },
    keyWord: {
        type: String
    },
    priceMin: {
        type: Number
    },
    priceMax: {
        type: Number
    },
    dateMin: {
        type: Date
    },
    dateMax: {
        type: Date
    }
}, {strict:false});

module.exports = mongoose.model('Finders', finderSchema);