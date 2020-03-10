'use strict';

const express = require('express');
var routerV1 = express.Router();
var routerV2 = express.Router();
var authController = require('../controllers/v2/authController');

module.exports = function(app) {
    var applicationsV1 = require('../controllers/v1/applicationController');
    var applicationsV2 = require('../controllers/v2/applicationController');
    
    routerV1.route('/applications')
        .get(applicationsV1.list_all_applications)
        .post(applicationsV1.create_an_application);
    routerV1.route('/applications/:applicationId')
        .get(applicationsV1.read_an_application)
        .put(applicationsV1.edit_an_application)
        .delete(applicationsV1.delete_an_application);
    routerV1.route('/applications/:applicationId/status')
        .patch(applicationsV1.edit_status_of_an_application)
    
    routerV2.route('/applications')
        .get(authController.verifyUser(["Explorer", "Manager"]), applicationsV2.list_all_applications)
        .post(authController.verifyUser(["Explorer"]), applicationsV2.create_an_application);
    routerV2.route('/applications/:applicationId')
        .get(authController.verifyUser(["Explorer", "Manager"]), applicationsV2.read_an_application)
        .put(authController.verifyUser(["Explorer"]), applicationsV2.edit_an_application)
        .delete(authController.verifyUser(["Administrator"]), applicationsV2.delete_an_application);
    routerV2.route('/applications/:applicationId/status')
        .patch(authController.verifyUser(["Explorer", "Manager"]), applicationsV2.edit_status_of_an_application)
    
    app.use("/v1/", routerV1);
    app.use("/v2/", routerV2);
}