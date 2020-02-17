var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongodb = require('mongodb');
//Après merge
//var mongoose = require('mongoose')
//Actors = mongoose.model('Actors');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Finders:
 *        type: object
 *        required:
 *          - idExplorer
 *        properties:
 *          idExplorer:
 *            type: mongodb.ObjectID
 *            description: Id of the explorer.
 *            example: 5e46e51d9ae2103198416348
 *          keyWord:
 *            type: String
 *            description: key words of the finder.
 *            example: 'keyword'
 *          priceMin:
 *            type: Number
 *            description: Price min of the finder.
 *            example: 224
 *          priceMax:
 *            type: Number
 *            description: Price max of the finder.
 *            example: 225
 *          dateMin:
 *            type: Date
 *            description: Date min of the finder.
 *            example: 2020-02-12
 *          dateMax:
 *            type: Date
 *            description: Date max of the finder.
 *            example: 2020-02-14
 */
var finderSchema = new Schema({
    idExplorer: {
        type: mongodb.ObjectID,
        required: 'Kindly enter the idExplorer of the finder',
        //Ajouter une fois merge
        /*validate: {
            validator: async function(v) {
                return Promise.resolve(Actors.findById(v, function(err, actor) {
                    return actor && actor.role == "Explorer";
                }));
            },
            message: "There are no explorer with this id"
        }*/
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