'use strict';
const express = require('express');
var routerv1 = express.Router();
var routerv2 = express.Router();

module.exports = function(app) {
    var actorsv1 = require('../controllers/v1/actorController');
    var actorsv2 = require('../controllers/v2/actorController');
    var auth = require('../controllers/v2/authController')

    routerv1.route('/actors')
        .get(actorsv1.list_all_actors)
        .post(actorsv1.create_an_actor);
        routerv1.route('/actors/:actorId')
        .get(actorsv1.read_an_actor)
        .put(actorsv1.edit_an_actor)
        .delete(actorsv1.delete_an_actor)
    routerv1.route('/actors/:actorId/ban')
        .patch(actorsv1.handle_actor_banishment)

    app.use("/v1", routerv1)

    routerv2.route('/actors')
        .get(actorsv2.list_all_actors)
        .post(actorsv2.create_an_actor);
    routerv2.route('/actors/:actorId')
        .get(actorsv2.read_an_actor)
        .put(actorsv2.edit_an_actor)
        .delete(auth.verifyUser(['Administrator']), actorsv2.delete_an_actor)
    routerv2.route('/actors/:actorId/ban')
        .patch(auth.verifyUser(['Administrator']), actorsv2.handle_actor_banishment)

    app.use("/v2", routerv2)
}