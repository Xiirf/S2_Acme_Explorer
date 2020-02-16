'use strict';
const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var sponsorships = require('../controllers/sponsorshipController');

    router.route('/sponsorships')
        .get(sponsorships.list_all_sponsorships)
        .post(sponsorships.create_a_sponsorship)
    router.route('/sponsorship/:sponsorshipId')
        .get(sponsorships.read_a_sponsorship)
        .put(sponsorships.edit_a_sponsorship)
        .delete(sponsorships.delete_a_sponsorship)
    router.route('/sponsorship/:sponsorshipId/pay')
        .patch(sponsorships.handle_sponsorship_payement)

    app.use("/v1", router)        
}