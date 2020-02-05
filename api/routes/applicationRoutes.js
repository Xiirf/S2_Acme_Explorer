'use strict';

module.exports = function(app) {
    var applications = require('../controllers/applicationController');
    
    app.route('applications')
        .get(applications.list_all_applications)
        .post(applications.create_an_application);
    app.route('applications/:applicationId')
        .get(applications.read_an_application)
        .put(applications.edit_an_application)
        .delete(applications.delete_an_application);     
}