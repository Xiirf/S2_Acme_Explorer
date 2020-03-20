const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
Actors = mongoose.model('Actors'),
Trips = mongoose.model('Trips'),
Sponsorships = mongoose.model('Sponsorships');

const { expect } = chai;
chai.use(chaiHttp);

describe('Sponsorships Integration tests', () => {
    var managerId;
    var sponsorId;
    var tripId;
    var sponsorshipId;
    var resPost;

    var getAllFunc = (done, callback) => chai
        .request(app)
        .get('/v1/sponsorships')
        .send()
        .end((err, res) => {
            if (err) {
                done(err);
            } 
            else {
                callback(res);
                done();
            }
        });

    var getByIdFunc = (done, callback) =>
        chai
        .request(app)
        .get('/v1/sponsorships/' + sponsorshipId)
        .send()
        .end((err, res) => {
            if (err) {
                done(err);
            } 
            else {
                callback(res);
                done();
            }
        });

    var putByIdFunc = (done, newActor, callback) =>
        chai
        .request(app)
        .put('/v1/sponsorships/' + sponsorshipId)
        .send(newActor)
        .end((err, res) => {
            if (err) {
                done(err);
            } 
            else {
                callback(res);
                done();
            }
        });
    
    var payByIdFunc = (done, patch, callback) =>
        chai
        .request(app)
        .patch('/v1/sponsorships/' + sponsorshipId + '/pay')
        .send(patch)
        .end((err, res) => {
            if (err) {
                done(err);
            } 
            else {
                callback(res);
                done();
            }
        });

    var deleteByIdFunc = (done, callback) =>
        chai
        .request(app)
        .delete('/v1/sponsorships/' + sponsorshipId)
        .send()
        .end((err, res) => {
            if (err) {
                done(err);
            } 
            else {
                callback(res);
                done();
            }
        });
    

    before((done) => {
        Sponsorships.collection.deleteMany({}, () => {
            Actors.collection.deleteMany({}, () => {
                done();
            });
        });
    });

    beforeEach(done => {
        chai
            .request(app)
            .post('/v1/actors')
            .send({
                "name": "Pedro",
                "surname": "Borita",
                "email": "t@t.com",
                "phone": "0123456789",
                "password": "pwd",
                "address": "algun lugar",
                "role": "Manager"
            })
            .end((err, resManager) => {
                managerId = resManager.body._id;
                if (err) {
                    done(err);
                } 
                else {
                    chai
                    .request(app)
                    .post('/v1/actors')
                    .send({
                        "name": "Antoño",
                        "surname": "Banderas",
                        "email": "f@f.com",
                        "phone": "012459786",
                        "password": "pwd",
                        "address": "algun lugar",
                        "role": "Sponsor"
                    })
                    .end((err, resSponsor) => {
                        if (err) {
                            done(err);
                        } 
                        else {
                            sponsorId = resSponsor.body._id;
                            chai
                            .request(app)
                            .post('/v1/trips')
                            .send({
                                "title": "testTitle",
                                "description": "testDescription",
                                "requirements": ["testRequirement"],
                                "start": "2020-02-12",
                                "end": "2020-02-28",
                                "stages": [
                                    {
                                        "title": "Paris",
                                        "description": "Paris step",
                                        "price": 620
                                    },
                                    {
                                        "title": "Rouen",
                                        "description": "Rouen step",
                                        "price": 380
                                    }
                                ],
                                "managerId": managerId
                            })
                            .end((err, resTrip) => {
                                tripId = resTrip.body._id;
                                if (err) {
                                    done(err);
                                } 
                                else {
                                    chai
                                    .request(app)
                                    .post('/v1/sponsorships')
                                    .send({
                                        "banner": ["img"],
                                        "link": "github.com/",
                                        "trip_id": tripId,
                                        "sponsor_id": sponsorId,
                                    })
                                    .end((err, res) => {
                                        if (err) {
                                            done(err);
                                        } 
                                        else {
                                            sponsorshipId = res.body._id;
                                            resPost = res;
                                            done();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
    });

    describe('POST Sponsorships', () => {
        it('should return status code 201', done => {
            expect(resPost).to.have.status(201);
            done();
        });
        it('should return the right sponsorship', done => {
            expect(resPost.body.link).to.eql("github.com/");
            expect(resPost.body.sponsor_id).to.eql(sponsorId);
            done();
        });
    });

    describe('GET Sponsorships', () => {
        it('should return status code 200', done => {
            getAllFunc(done, res => expect(res).to.have.status(200));
        });
        it('should return the right sponsorship', done => {
            getAllFunc(done, res => expect(res.body[res.body.length - 1].link).to.eql("github.com/") && expect(res.body[res.body.length - 1].sponsor_id).to.eql(sponsorId));
        });
    });

    describe('GET Sponsorships id', () => {
        it('should return status code 200', done => {
            getByIdFunc(done, res => expect(res).to.have.status(200));
        });
        it('should return the right sponsorship', done => {
            getByIdFunc(done, res => expect(res.body.link).to.eql("github.com/") && expect(res.body.sponsor_id).to.eql(sponsorId));
        });
    });

    describe('PUT Sponsorships id', () => {
        var correctSponsorship = {
            "banner": {
                "0": "img"
            },
            "_id": sponsorshipId,
            "payed": false,
            "link": "google.com/",
            "trip_id": tripId,
            "sponsor_id": sponsorId,
            "__v": 0
        };
        var wrongSponsorship = {
            "banner": {
                "0": "img"
            },
            "_id": sponsorshipId,
            "payed": "Not a boolean",
            "link": "google.com/",
            "trip_id": tripId,
            "sponsor_id": 0,
            "__v": 0
        };
        it('should return status code 200', done => {
            putByIdFunc(done, correctSponsorship, res => expect(res).to.have.status(200));
        });
        it('should return the right sponsorship', done => {
            putByIdFunc(done, correctSponsorship,  res => expect(res.body.link).to.eql("google.com/"));
        });
        it('should return status code 422', done => {
            putByIdFunc(done, wrongSponsorship, res => expect(res).to.have.status(422));
        });
    });

    describe('PATCH Sponsorships id pay', () => {
        var correctPatch = {
            "payed": true,
        };
        var wrongPatch = {
            "payed": "Not a boolean"
        };
        it('should return status code 200', done => {
            payByIdFunc(done, correctPatch, res => expect(res).to.have.status(200));
        });
        it('should return the right payed sponsorship', done => {
            payByIdFunc(done, correctPatch,  res => expect(res.body.payed).to.be.true && expect(res.body.price).to.be.gte(0));
        });
        it('should return status code 422', done => {
            payByIdFunc(done, wrongPatch, res => expect(res).to.have.status(422));
        });
    });

    describe('DELETE Sponsorships id', () => {
        it('should return status code 204', done => {
            deleteByIdFunc(() => {}, res => {
                expect(res).to.have.status(204)
                // Verify that delete is idempotent
                deleteByIdFunc(done, res => expect(res).to.have.status(204));
            });
        });
    });

    afterEach(done => {
        chai
        .request(app)
        .delete('/v1/sponsorships/' + sponsorshipId)
        .send()
        .end((err, res) => {
            if (err) {
                done(err);
            } 
            else {
                chai
                .request(app)
                .delete('/v1/trips/' + tripId)
                .send()
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } 
                    else {
                        chai
                        .request(app)
                        .delete('/v1/actors/' + sponsorId)
                        .send()
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            } 
                            else {
                                chai
                                .request(app)
                                .delete('/v1/actors/' + managerId)
                                .send()
                                .end((err, res) => {
                                    if (err) {
                                        done(err);
                                    } 
                                    else {
                                        done();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    })

    after((done) => {
        Sponsorships.collection.deleteMany({}, () => {
            Actors.collection.deleteMany({}, () => {
                done();
            });
        });
    });
})