'use strict';
module.exports = function(app) {
    var stages = require('../controllers/stageController');
    
    app.route('/stages')
        .get(stages.list_all_stages)
        .post(stages.create_a_stage)
    app.route('/stages/:stageId')
        .get(stages.read_a_stage)
        .put(stages.edit_a_stage)
        .delete(stages.delete_a_stage)        
}