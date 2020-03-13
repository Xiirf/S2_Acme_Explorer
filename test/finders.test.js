const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
Actors = mongoose.model('Actors'),
Finders = mongoose.model('Finders');

const { expect } = chai;
chai.use(chaiHttp);

describe('Integration tests', () => {
    var actorId = null;
    var finderId = null;

    before((done) => {
        Actors.collection.deleteMany({});
        Finders.collection.deleteMany({});

        chai
            .request(app)
            .post('/v1/actors')
            .send({
                "name": "Antoño",
                "surname": "Banderas",
                "email": "f@f.com",
                "phone": "012459786",
                "password": "pwd",
                "adress": "algun lugar",
                "role": "Explorer"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } 
                else {
                    actorId = res.body._id;
                    done();
                }
            });
    });

    after((done) => {
        Finders.collection.deleteMany({});
        Actors.collection.deleteMany({});

        done();
    })

    describe('POST finders', () => {
        it('should return status code 201', done => {
            chai
                .request(app)
                .post('/v1/finders')
                .send({
                    "idExplorer": actorId,
                    "keyWord": "Rouen",
                    "priceMin": 200,
                    "priceMax": 500,
                    "dateMin": "2020-02-12",
                    "dateMax": "2020-02-28"
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.idExplorer).to.equals(actorId);
                    expect(res.body.keyWord).to.equals("Rouen");
                    expect(res.body.priceMin).to.equals(200);
                    expect(res.body.priceMax).to.equals(500);

                    if (err) {
                        done(err);
                    }
                    else {
                        finderId = res.body._id;
                        done();
                    }
                });
        });

        it('should return status code 422', done => {
            chai
                .request(app)
                .post('/v1/finders')
                .send({
                    "keyWord": "Dijon",
                    "priceMin": 200,
                    "priceMax": 500,
                    "dateMin": "2020-02-12",
                    "dateMax": "2020-02-28"
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('GET finders', () => {
        it('should return status code 200', done => {
            chai
                .request(app)
                .get('/v1/finders')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equals(1);
                    expect(res.body[0].idExplorer).to.equals(actorId);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('GET finders/:findersId', () => {
        it('should return status code 200', done => {
            chai
                .request(app)
                .get('/v1/finders/'+finderId)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.idExplorer).to.equals(actorId);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .get('/v1/finders/'+actorId)
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('PUT finders/:findersId', () => {
        it('should return status code 200', done => {
            chai
                .request(app)
                .put('/v1/finders/'+finderId)
                .send({
                    "idExplorer": actorId,
                    "keyWord": "Dijon",
                    "priceMin": 250,
                    "priceMax": 600,
                    "dateMin": "2020-02-12",
                    "dateMax": "2020-02-28"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.idExplorer).to.equals(actorId);
                    expect(res.body.keyWord).to.equals("Dijon");
                    expect(res.body.priceMin).to.equals(250);
                    expect(res.body.priceMax).to.equals(600);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 500', done => {
            chai
                .request(app)
                .put('/v1/finders/'+finderId)
                .send({
                    "keyWord": 45,
                    "priceMin": "Sevilla",
                    "priceMax": 400,
                    "dateMin": "2020-02-12",
                    "dateMax": "2020-02-28"
                })
                .end((err, res) => {
                    expect(res).to.have.status(500);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .put('/v1/finders/'+actorId)
                .send({
                    "idExplorer": actorId,
                    "keyWord": "Dijon",
                    "priceMin": 250,
                    "priceMax": 600,
                    "dateMin": "2020-02-12",
                    "dateMax": "2020-02-28"
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('DELETE finders/:findersId', () => {
        it('should return status code 204', done => {
            chai
                .request(app)
                .delete('/v1/finders/'+finderId)
                .end((err, res) => {
                    expect(res).to.have.status(204);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 204', done => {
            chai
                .request(app)
                .delete('/v1/finders/'+finderId)
                .end((err, res) => {
                    expect(res).to.have.status(204);

                    if (err) done(err);
                    else done();
                });
        });
    });
});