'use strict';
/*---------------ACTOR Auth----------------------*/
var mongoose = require('mongoose'),
    Actor = mongoose.model('Actors');
var admin = require('firebase-admin');
var LangDictionnary = require('../langDictionnary');
var dict = new LangDictionnary();

exports.getUserId = async function (idToken) {
    console.log('idToken: ' + idToken);
    idToken = idToken.replace('Bearer ', '');
    var id = null;

    var actorFromFB = await admin.auth().verifyIdToken(idToken);

    var uid = actorFromFB.uid;
    var auth_time = actorFromFB.auth_time;
    var exp = actorFromFB.exp;
    console.log('idToken verificado para el uid: ' + uid);
    console.log('auth_time: ' + auth_time);
    console.log('exp: ' + exp);

    var mongoActor = await Actor.findOne({ email: uid });
    if (!mongoActor) { return null; }

    else {
        console.log('The actor exists in our DB');
        console.log('actor: ' + mongoActor);
        id = mongoActor._id;
        return id;
    }
}


exports.verifyUser = function (requiredRoles) {
    return function (req, res, callback) {
        console.log('starting verifying idToken');
        console.log('requiredRoles: ' + requiredRoles);
        var idToken = req.headers['authorization'];
        var lang = dict.getLang(req);

        if(!idToken) {
            res.status(401).send({ err: dict.get('Unauthorized', lang) });
        } else {
            idToken = idToken.replace('Bearer ', '');
            admin.auth().verifyIdToken(idToken).then(function (decodedToken) {
                console.log('entra en el then de verifyIdToken: ');
    
                var uid = decodedToken.uid;
                var auth_time = decodedToken.auth_time;
                var exp = decodedToken.exp;
                console.log('idToken verificado para el uid: ' + uid);
                console.log('auth_time: ' + auth_time);
                console.log('exp: ' + exp);
    
                Actor.findOne({ email: uid }, function (err, actor) {
                    if (err) { res.send(err); }
    
                    // No actor found with that email as username
                    else if (!actor) {
                        res.status(404).send({ err: dict.get('RessourceNotFound', lang, 'actor', uid) });
                    }
    
                    else {
                        console.log('The actor exists in our DB');
                        console.log('actor: ' + actor);
    
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
                console.log("Error en autenticación: " + err);
                res.status(403).send({ err: dict.get('Forbidden', lang) });
            });
        }
    }
}