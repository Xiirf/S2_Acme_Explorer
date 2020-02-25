'use strict';
var mongoose = require('mongoose');
var Applications = mongoose.model('Applications');

var DataWareHouseSchema = new mongoose.Schema({
  statsNumberTripsByManager: {
    avg: {
        type: Number,
        min: 0
    }, min: {
        type: Number,
        min: 0
    }, max: {
        type: Number,
        min: 0
    }, stdDeviation: {
        type: Number
    }
  },
  statsNumberApplicationByTrips: {
    avg: {
        type: Number,
        min: 0
    }, min: {
        type: Number,
        min: 0
    }, max: {
        type: Number,
        min: 0
    }, stdDeviation: {
        type: Number,
        min: 0
    }
  },
  statsPriceByTrips: {
    avg: {
        type: Number,
        min: 0
    }, min: {
        type: Number,
        min: 0
    }, max: {
        type: Number,
        min: 0
    }, stdDeviation: {
        type: Number,
        min: 0
    }
  },
    ratioApplicationsByStatus: [{
        _id: false,
        status: {
            type: String,
            enum: Applications.schema.path('status').enumValues
        }, ratio: {
            type: Number,
            max: 1,
            min: 0
        }
    }],
computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  }
}, { strict: false });

DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);