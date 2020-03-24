'use strict';

var mongoose = require('mongoose'),
POIs = mongoose.model('POIs');
var LangDictionnary = require('../../langDictionnary');
var dict = new LangDictionnary();

exports.list_all_pois = function(req, res) {
    var lang = dict.getLang(req);
    POIs.find({}, function(err, pois) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        }
        else {
            res.status(200).json(pois);
        }
    });
}

exports.create_a_poi = function(req, res) {
    var lang = dict.getLang(req);
    var new_poi = new POIs(req.body);
    new_poi.save(function(err, poi) {
        if (err) {
            if (err.name=='ValidationError') {
                res.status(422).send({ err: dict.get('ErrorSchema', lang) });
            }
            else{
                res.status(500).send({ err: dict.get('ErrorCreateDB', lang) });
            }
        }
        else {
            res.status(201).json(poi);
        }
    });
}

exports.read_a_poi = function(req, res) {
    var lang = dict.getLang(req);
    POIs.findById(req.params.poiId, function(err, poi) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorGetDB', lang) });
        } 
        else if (!poi) {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'poi', req.params.poiId) });
        }
        else {
            res.json(poi);
        }
    })
}

exports.edit_a_poi = function(req, res) {
    var lang = dict.getLang(req);
    var updatedPoi = req.body;

    POIs.findById(req.params.poiId, function(err, poi) {
        if (err) {
            res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
        }
        if (poi) {
            poi = Object.assign(poi, updatedPoi);
            poi.save(function(err2, newFinder) {
                if (err2) {
                    if(err2.name=='ValidationError') {
                        res.status(422).send({ err: dict.get('ErrorSchema', lang) });
                    }
                    else{
                        console.error(err2);
                        res.status(500).send({ err: dict.get('ErrorUpdateDB', lang) });
                    }
                } else {
                    res.send(newFinder);
                }
            });
        } else {
            res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'poi', req.params.poiId) });
        }
    })
}

exports.delete_a_poi = function(req, res) {
    var lang = dict.getLang(req);
    var id = req.params.poiId
    POIs.findOneAndDelete({"_id": id}, null, function(err, poi) {
        if(err) {
            res.status(500).send({ err: dict.get('ErrorDeleteDB', lang) });
        } 
        else {
            res.sendStatus(204);
        }
    })
}