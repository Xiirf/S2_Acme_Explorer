'use strict';
var mongoose = require('mongoose');
var Applications = mongoose.model('Applications');

/**
 * @swagger
 *  components:
 *    schemas:
 *      statsDataWareHouse:
 *        type: object
 *        required:
 *          - statsNumberTripsByManager
 *          - statsNumberApplicationByTrips
 *          - statsPriceByTrips
 *          - ratioApplicationsByStatus
 *        properties:
 *          statsNumberTripsByManager:
 *            type: object
 *            description: global statistics on the number of trips per manager
 *            required:
 *              - avg
 *              - min
 *              - max
 *              - stdDeviation
 *            properties:
 *              avg:
 *                type: number
 *                example: 1
 *              min: 
 *                type: integer
 *                example: 1
 *              max:
 *                type: integer
 *                example: 1
 *              stdDeviation:
 *                type: number
 *                example: 0
 *          statsNumberApplicationByTrips:
 *            type: object
 *            description: global statistics on the number of application per trip
 *            required:
 *              - avg
 *              - min
 *              - max
 *              - stdDeviation
 *            properties:
 *              avg:
 *                type: number
 *                example: 1
 *              min: 
 *                type: integer
 *                example: 1
 *              max:
 *                type: integer
 *                example: 1
 *              stdDeviation:
 *                type: number
 *                example: 0
 *          statsPriceByTrips:
 *            type: object
 *            description: global statistics on the price of trips
 *            required:
 *              - avg
 *              - min
 *              - max
 *              - stdDeviation
 *            properties:
 *              avg:
 *                type: number
 *                example: 1
 *              min: 
 *                type: number
 *                example: 1
 *              max:
 *                type: number
 *                example: 1
 *              stdDeviation:
 *                type: number
 *                example: 0
 *          ratioApplicationsByStatus:
 *            type: array
 *            description: ratios of the number of application per status
 *            items:
 *              type: object
 *              required:
 *                - status
 *                - ratio
 *              properties:
 *                status:
 *                  type: string
 *                  enum: ['REJECTED', 'PENDING', 'DUE', 'ACCEPTED', 'CANCELLED']
 *                ratio: 
 *                  type: number
 *                  example: 0.25
 */
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