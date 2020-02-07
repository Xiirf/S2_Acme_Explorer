'use strict';
module.exports = function(app) {
    var actors = require('../controllers/actorController');
    
    app.route('/actors')
        .get(actors.list_all_actors)
        .post(actors.create_an_actor)
    app.route('/actor/:actorName')
        .get(actors.read_an_actor)
        .put(actors.edit_an_actor)
        .delete(actors.delete_an_actor)        
}