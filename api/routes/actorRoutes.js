'use strict';
const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var actorsv1 = require('../controllers/v1/actorController');
    var actorsv2 = require('../controllers/v2/actorController');
    var auth = require('../controllers/authController')

    router.route('/actors')
        .get(actorsv1.list_all_actors)
        .post(actorsv1.create_an_actor);
    router.route('/actors/:actorId')
        .get(actorsv1.read_an_actor)
        .put(actorsv1.edit_an_actor)
        .delete(actorsv1.delete_an_actor)
    router.route('/actors/:actorId/ban')
        .patch(actorsv1.handle_actor_banishment)

    app.use("/v1", router)

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