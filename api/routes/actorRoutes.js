'use strict';
const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var actors = require('../controllers/actorController');

    router.route('/actors')
        .get(actors.list_all_actors)
        .post(actors.create_an_actor);
    router.route('/actor/:actorId')
        .get(actors.read_an_actor)
        .put(actors.edit_an_actor)
        .delete(actors.delete_an_actor)
    router.route('/actor/:actorId/ban')
        .patch(actors.handle_actor_banishment)

    app.use("/v1", router)
}