'use strict';

const express = require('express');
var router = express.Router();

module.exports = function(app) {
    var applications = require('../controllers/applicationController');
    
    router.route('/applications')
        .get(applications.list_all_applications)
        .post(applications.create_an_application);
    router.route('/applications/:applicationId')
        .get(applications.read_an_application)
        .put(applications.edit_an_application)
        .patch(applications.pay_an_application)
        .delete(applications.delete_an_application);
    
    app.use("/v1/", router);
}