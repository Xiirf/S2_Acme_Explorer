const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
Actors = mongoose.model('Actors');

const { expect } = chai;
chai.use(chaiHttp);

describe('Actors Integration tests', () => {
    var actorId;
    var resPost;

    var getAllFunc = (done, callback) => chai
        .request(app)
        .get('/v1/actors')
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
        .get('/v1/actors/' + actorId)
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
        .put('/v1/actors/' + actorId)
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

    var banByIdFunc = (done, patch, callback) =>
        chai
        .request(app)
        .patch('/v1/actors/' + actorId + '/ban')
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
        .delete('/v1/actors/' + actorId)
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
        Actors.collection.deleteMany({}, () => {
            done();
        });
    });

    beforeEach(done => {
        chai
            .request(app)
            .post('/v1/actors')
            .send({
                "name": "Medor",
                "surname": "pekino",
                "email": "f@f.com",
                "phone": "012459786",
                "password": "s",
                "adress": "d",
                "role": "Administrator"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } 
                else {
                    actorId = res.body._id;
                    resPost = res;
                    done();
                }
            });
    });

    describe('POST Actors', () => {
        it('should return status code 201', done => {
            expect(resPost).to.have.status(201);
            done();
        });
        it('should return the right actor', done => {
            expect(resPost.body.name).to.eql("Medor");
            expect(resPost.body.surname).to.eql("pekino");
            done();
        });
    });

    describe('GET Actors', () => {
        it('should return status code 200', done => {
            getAllFunc(done, res => expect(res).to.have.status(200));
        });
        it('should return the right actor', done => {
            getAllFunc(done, res => expect(res.body[res.body.length - 1].name).to.eql("Medor") && expect(res.body[res.body.length - 1].surname).to.eql("pekino"));
        });
    });

    describe('GET Actors id', () => {
        it('should return status code 200', done => {
            getByIdFunc(done, res => expect(res).to.have.status(200));
        });
        it('should return the right actor', done => {
            getByIdFunc(done, res => expect(res.body.name).to.eql("Medor") && expect(res.body.surname).to.eql("pekino"));
        });
    });

    describe('PUT Actors id', () => {
        var correctActor = {
            "_id": actorId,
            "name": "Medor",
            "surname": "pekino",
            "email": "f@f.com",
            "phone": "987654321",
            "password": "s",
            "adress": "d",
            "role": "Sponsor"
        };
        var wrongActor = {
            "_id": actorId,
            "name": "Medor",
            "surname": "pekino",
            "email": "not an email",
            "phone": "987654321",
            "password": "s",
            "adress": "d",
            "role": "NonExistantRole"
        };
        it('should return status code 200', done => {
            putByIdFunc(done, correctActor, res => expect(res).to.have.status(200));
        });
        it('should return the right actor', done => {
            putByIdFunc(done, correctActor,  res => expect(res.body.phone).to.eql("987654321") && expect(res.body.role).to.eql("Sponsor"));
        });
        it('should return status code 422', done => {
            putByIdFunc(done, wrongActor, res => expect(res).to.have.status(422));
        });
    });

    describe('PATCH Actors id pay', () => {
        var correctPatch = {
            "banned": true,
        };
        var wrongPatch = {
            "banned": "Not a boolean"
        };
        it('should return status code 200', done => {
            banByIdFunc(done, correctPatch, res => expect(res).to.have.status(200));
        });
        it('should return the right banned actor', done => {
            banByIdFunc(done, correctPatch,  res => expect(res.body.banned).to.be.true);
        });
        it('should return status code 422', done => {
            banByIdFunc(done, wrongPatch, res => expect(res).to.have.status(422));
        });
    });

    describe('DELETE Actors id', () => {
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
            .delete('/v1/actors/' + actorId)
            .send()
            .end((err, res) => {
                if (err) {
                    done(err);
                } 
                else {
                    done();
                }
            });
    })

    after((done) => {
        Actors.collection.deleteMany({}, () => {
            done();
        });
    });
})