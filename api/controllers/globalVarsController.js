var mongoose = require('mongoose')
GlobalVars = mongoose.model('GlobalVars');

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
    GlobalVars.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }, function(err, globalVars) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.json(globalVars);
        }
    })
}
