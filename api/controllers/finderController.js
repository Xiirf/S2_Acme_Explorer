'use strict';

var mongoose = require('mongoose'),
Finder = mongoose.model('Finders');

exports.list_all_finders = function(req, res) {
    Finder.find({}, function(err, finders) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(finders);
        }
    });
}

exports.create_an_finder = function(req, res) {
    var new_finder = new Finder(req.body);
    new_finder.save(function(err, finder) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(finder);
        }
    });
}

exports.read_an_finder = function(req, res) {
    Finder.findById(req.params.finderId, function(err, finder) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(finder);
        }
    })
}

exports.update_an_finder = function(req, res) {
    Finder.findOneAndUpdate({_id: req.params.finderId}, req.body, function(err, finder) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(finder);
        }
    })
}

exports.delete_an_finder = function(req, res) {
    Finder.remove({_id: req.params.finderId}, function(err) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({message: 'Finder successfully deleted'});
        }
    })
}