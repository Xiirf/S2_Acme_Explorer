var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongodb = require('mongodb');
var mongoose = require('mongoose');

var poiSchema = new Schema({
    title: {
        type: String,
        required: 'Kindly enter the title of the POI',
    },
    description: {
        type: String,
        required: 'Kindly enter the description of the POI',
    },
    coordinates: {
        type: String
    },
    type: {
        type: String
    }
}, {strict:false});

poiSchema.index( { title: 1} );
poiSchema.index( { type: 1} );

module.exports = mongoose.model('POIs', poiSchema);