'use strict';
module.exports = function(app) {
  var actors = require('../controllers/actorController');

  /**
	 * Get custom auth token, for an actor by providing email and password
	 *
	 * @section actors
	 * @type get
	 * @url /v1/actors/login/
	 * @param {string} email
   * @param {string} password
	*/
  app.route('/v1/login/')
    .get(actors.login_an_actor);
};
