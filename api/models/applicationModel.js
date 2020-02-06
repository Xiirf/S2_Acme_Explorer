var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
    idExplorer: {
        type: String,
        required: 'Kindly enter the idExplorer of the application'
    },
    idTrip: {
        type: String,
        required: 'Kindly enter the idTrip of the application'
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
        type: String
    }
}, {strict:false});

module.exports = mongoose.model('Applications', applicationSchema);