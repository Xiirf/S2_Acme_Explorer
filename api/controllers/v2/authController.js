'use strict';
/*---------------ACTOR Auth----------------------*/
var mongoose = require('mongoose'),
    Actor = mongoose.model('Actors');
var admin = require('firebase-admin');
var LangDictionnary = require('../../langDictionnary');
var dict = new LangDictionnary();

exports.getUserId = async function (idToken) {
    idToken = idToken.replace('Bearer ', '');
    var id = null;

    var actorFromFB = await admin.auth().verifyIdToken(idToken);

    var uid = actorFromFB.uid;
    var auth_time = actorFromFB.auth_time;
    var exp = actorFromFB.exp;

    var mongoActor = await Actor.findOne({ email: uid });
    if (!mongoActor) { return null; }

    else {
        id = mongoActor._id;
        return id;
    }
}


exports.verifyUser = function (requiredRoles) {
    return function (req, res, callback) {
        var idToken = req.headers['authorization'];
        var lang = dict.getLang(req);

        if(!idToken) {
            res.status(401).send({ err: dict.get('Unauthorized', lang) });
        } else {
            idToken = idToken.replace('Bearer ', '');
            admin.auth().verifyIdToken(idToken).then(function (decodedToken) {    
                var uid = decodedToken.uid;
                var auth_time = decodedToken.auth_time;
                var exp = decodedToken.exp;
    
                Actor.findOne({ email: uid }, function (err, actor) {
                    if (err) { res.send(err); }
    
                    // No actor found with that email as username
                    else if (!actor) {
                        res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', uid) });
                    }
    
                    else {    
                        var isAuth = false;
                        for (var i = 0; i < requiredRoles.length; i++) {
                            if (requiredRoles[i] === actor.role) {
                                isAuth = true;
                            }
                        }
                        if (isAuth) return callback(null, actor);
                        else {
                            res.status(403).send({ err: dict.get('Forbidden', lang) });
                        }
                    }
                });
            }).catch(function (err) {
                // Handle error
                res.status(403).send({ err: dict.get('Forbidden', lang) });
            });
        }
    }
}

exports.getUserRoleAndId = async function (idToken) {
    return this.getUserId(idToken).then((idActor) => {
        return Actor.findById(idActor).then((actor) => {
            return {id: idActor, role: actor.role};
        });
    })
}