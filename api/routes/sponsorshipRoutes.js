'use strict';
module.exports = function(app) {
    var sponsorships = require('../controllers/sponsorshipController');
    app.route('/sponsorships')
        .get(sponsorships.list_all_sponsorships)
        .post(sponsorships.create_a_sponsorship)
    app.route('/sponsorship/:sponsorshipId')
        .get(sponsorships.read_a_sponsorship)
        .put(sponsorships.edit_a_sponsorship)
        .delete(sponsorships.delete_a_sponsorship)        
}