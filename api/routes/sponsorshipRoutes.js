'use strict';
const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var sponsorships = require('../controllers/v2/sponsorshipController');
    var auth = require('../controllers/authController');

    router.route('/sponsorships')
        .get(sponsorships.list_all_sponsorships)
        .post(sponsorships.create_a_sponsorship)
    router.route('/sponsorships/:sponsorshipId')
        .get(sponsorships.read_a_sponsorship)
        .put(sponsorships.edit_a_sponsorship)
        .delete(sponsorships.delete_a_sponsorship)
    router.route('/sponsorships/:sponsorshipId/pay')
        .patch(sponsorships.handle_sponsorship_payement)
    router.route('/sponsorships/flatRate')
        .patch(auth.verifyUser(['Administrator']), sponsorships.handle_flat_rate_change)

    app.use("/v1", router)        
}