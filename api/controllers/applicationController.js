'use strict';

var mongoose = require('mongoose'),
Application = mongoose.model('Applications');

exports.list_all_applications = function(req, res) {
    Application.find({}, function(err, applications) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(applications);
        }
    });
}

exports.create_an_application = function(req, res) {
    var new_application = new Application(req.body);
    new_application.save(function(err, application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(application);
        }
    });
}

exports.read_an_application = function(req, res) {
    Application.findById(req.params.applicationId, function(err, application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(application);
        }
    })
}

exports.update_an_application = function(req, res) {
    Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, function(err, application) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(application);
        }
    })
}

exports.delete_an_application = function(req, res) {
    Application.remove({_id: req.params.applicationId}, function(err) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({message: 'Application successfully deleted'});
        }
    })
}