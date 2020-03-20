var mongoose = require('mongoose')
GlobalVars = mongoose.model('GlobalVars');
var LangDictionnary = require('../../langDictionnary');
var dict = new LangDictionnary();
var Cacheman = require('cacheman');
var cache = require('./tripController').cache;

 /**
 * @swagger
 * path:
 *  '/globalVars':
 *    get:
 *      tags:
 *        - GlobalVars
 *      description: >-
 *        Retrieve the global variables defined in the API
 *      operationId: getGlobalVars
 *      responses:
 *        '200':
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/GlobalVars'
 *        '500':
 *           description: Internal server error
 *           content: {}
 */

exports.list_global_vars = function(req, res) {
    var lang = dict.getLang(req);
    GlobalVars.find({}, function(err, globalVars) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!globalVars.length) {
            globalVars = new GlobalVars()
            globalVars.save(function(err, vars) {
                if (err) {
                    if(err.name=='ValidationError') {
                        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                    }
                    else{
                        res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
                    }
                }
                else {
                    res.status(200).json(vars);
                }
            });
        }
        else {
            res.status(200).json(globalVars[0]);
        }
    });
}

/**
 * @swagger
 * path:
 *  '/globalVars/cacheTimeOutFinderResults':
 *    patch:
 *      summary: Change the cache time out for the finder results
 *      tags: [GlobalVars]
 *      parameters:
 *         - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - cacheTimeOutFinderResults
 *              properties:
 *                cacheTimeOutFinderResults:
 *                  type: number
 *      responses:
 *        '200':
 *          description: Updated application
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/GlobalVars'
 *        '422':
 *           description: Incorrect body
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.edit_cache_time_out = function(req, res) {
    var cacheTimeOutFinderResults = req.body ? req.body.cacheTimeOutFinderResults : undefined;
    var lang = dict.getLang(req);
    if ((cacheTimeOutFinderResults !== 0 && !cacheTimeOutFinderResults) || typeof(cacheTimeOutFinderResults) != "number") {
        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
    } else {
        GlobalVars.findOneAndUpdate({}, { "cacheTimeOutFinderResults": cacheTimeOutFinderResults }, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }, function(err, globalVars) {
            if (err) {
                if(err.name=='ValidationError') {
                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                }
                else{
                    res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                }
            } else {
                res.status(200).send(globalVars);
            }
        });
    }
}

/**
 * @swagger
 * path:
 *  '/globalVars/maxNumberFinderResults':
 *    patch:
 *      summary: Change the max number of results for a finder search
 *      tags: [GlobalVars]
 *      parameters:
 *         - $ref: '#/components/parameters/language'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - maxNumberFinderResults
 *              properties:
 *                maxNumberFinderResults:
 *                  type: number
 *      responses:
 *        '200':
 *          description: Updated application
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/GlobalVars'
 *        '422':
 *           description: Incorrect body
 *           content: {}
 *        '500':
 *           description: Internal server error
 *           content: {}
 */
exports.edit_max_number_finder_results = function(req, res) {
    var maxNumberFinderResults = req.body ? req.body.maxNumberFinderResults : undefined;
    var lang = dict.getLang(req);
    if ((maxNumberFinderResults !== 0 && !maxNumberFinderResults) || typeof(maxNumberFinderResults) != "number") {
        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
    } else {
        GlobalVars.findOneAndUpdate({}, { "maxNumberFinderResults": maxNumberFinderResults }, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }, function(err, globalVars) {
            if (err) {
                if(err.name=='ValidationError') {
                    res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                }
                else{
                    res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                }
            } else {
                res.status(200).send(globalVars);
            }
        });
    }
}
