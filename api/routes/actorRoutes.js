'use strict';
const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var actorsv2 = require('../controllers/v2/actorController');
    var auth = require('../controllers/authController')

    router.route('/actors')
        .get(actorsv2.list_all_actors)
        .post(actorsv2.create_an_actor);
    router.route('/actors/:actorId')
        .get(actorsv2.read_an_actor)
        .put(actorsv2.edit_an_actor)
        .delete(auth.verifyUser(['Administrator']), actorsv2.delete_an_actor)
    router.route('/actors/:actorId/ban')
        .patch(auth.verifyUser(['Administrator']), actorsv2.handle_actor_banishment)

    app.use("/v2", router)
}