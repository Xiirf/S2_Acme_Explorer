var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/**
 * @swagger
 *  components:
 *    schemas:
 *      GlobalVars:
 *        allOf:
 *        - type: object
 *          properties:
 *            _id:
 *              type: string
 *            flatRateSponsorships:
 *              type: number
 *            cacheTimeOutFinderResults:
 *              type: integer
 *            maxNumberFinderResults:
 *              type: integer
 *            __v:
 *              type: integer
 */
var globalVarsModel = new Schema({
    flatRateSponsorships: {
        type: Number,
        default: 0,
        min: 0
    }, cacheTimeOutFinderResults: {
        type: Number,
        default: 1,  // in hours
        min: 1,
        max: 10
    }, maxNumberFinderResults: {
        type: Number,
        default: 10,
        min: 0,
        max: 100
    }
}, {
    strict: false
}) 

module.exports = mongoose.model ('GlobalVars', globalVarsModel);