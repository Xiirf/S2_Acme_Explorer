var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/**
 * @swagger
 *  components:
 *    schemas:
 *      Cube:
 *        allOf:
 *        - type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *              flatRateSponsorships:
 *                type: number
 *              cacheTimeOutFinderResults:
 *                type: integer
 *              maxNumberFinderResults:
 *                type: integer
 *              __v:
 *                type: integer
 */
var cubeModel = new Schema({
    rows: [{
            month: {
                type: Number,
                min: 0,
                max: 11,
                required: true
            },
            year: {
                type: Number,
                min: 0,
                required: true
            },
            idExplorer: {
                type: String,
                required: true
            },
            moneySpent: {
                type: Number,
                min: 0,
                required: true
            }
        }]
    }, {
    strict: false
}) 

module.exports = mongoose.model ('Cube', cubeModel);