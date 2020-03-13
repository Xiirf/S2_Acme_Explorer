const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
Actors = mongoose.model('Actors'),
Trips = mongoose.model('Trips'),
Applications = mongoose.model('Applications');

const { expect } = chai;
chai.use(chaiHttp);

describe('Integration tests', () => {
    var managerId = null;
    var explorerId = null;
    var tripId = null;
    var applicationId = null;

    before((done) => {
        Actors.collection.deleteMany({});
        Trips.collection.deleteMany({});
        Applications.collection.deleteMany({});

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
                "role": "Manager"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } 
                else {
                    managerId = res.body._id;
                    console.log("MANAGER " + managerId)
                }
            });

        chai
            .request(app)
            .post('/v1/actors')
            .send({
                "name": "Pierre",
                "surname": "Paul",
                "email": "foo@fr.com",
                "phone": "012459786",
                "password": "123",
                "adress": "algun lugar",
                "role": "Explorer"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } 
                else {
                    explorerId = res.body._id;
                    console.log("EXPLORER " + explorerId)
                }
            });

        chai
            .request(app)
            .post('/v1/trips')
            .send({
                "title": "testTitle",
                "description": "testDescription",
                "requirements": ["testRequirement"],
                "start": "2021-02-12",
                "end": "2021-02-28",
                "published": true,
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
            .end((err, res) => {
                if (err) {
                    done(err);
                } 
                else {
                    tripId = res.body._id;
                    console.log("TRIP " + tripId)
                    done();
                }
            });
    });

    after((done) => {
        Finders.collection.deleteMany({});
        Actors.collection.deleteMany({});
        Applications.collection.deleteMany({});

        done();
    })

    describe('POST applications', () => {
        it('should return status code 201', done => {
            console.log(explorerId);
            console.log(tripId);
            chai
                .request(app)
                .post('/v1/applications')
                .send({
                    "idExplorer": explorerId,
                    "idTrip": tripId,
                    "status": "PENDING",
                    "comments": [
                      "A comment",
                      "Another comment"
                    ]
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.idExplorer).to.equals(explorerId);
                    expect(res.body.idTrip).to.equals(tripId);
                    expect(res.body.status).to.equals("PENDING");

                    if (err) {
                        done(err);
                    }
                    else {
                        applicationId = res.body._id;
                        done();
                    }
                });
        });

        it('should return status code 422', done => {
            chai
                .request(app)
                .post('/v1/applications')
                .send({
                    "idExplorer": explorerId,
                    "status": "PENDING",
                    "comments": [
                      "A comment",
                      "Another comment"
                    ]
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);

                    if (err) done(err);
                    else done();
                });
        });
    });

//     describe('GET applications', () => {
//         it('should return status code 200', done => {
//             chai
//                 .request(app)
//                 .get('/v1/applications')
//                 .end((err, res) => {
//                     expect(res).to.have.status(200);
//                     expect(res.body.length).to.equals(1);
//                     expect(res.body[0].idExplorer).to.equals(actorId);

//                     if (err) done(err);
//                     else done();
//                 });
//         });
//     });

//     describe('GET applications/:applicationsId', () => {
//         it('should return status code 200', done => {
//             chai
//                 .request(app)
//                 .get('/v1/applications/'+applicationId)
//                 .end((err, res) => {
//                     expect(res).to.have.status(200);
//                     expect(res.body.idExplorer).to.equals(actorId);

//                     if (err) done(err);
//                     else done();
//                 });
//         });

//         it('should return status code 404', done => {
//             chai
//                 .request(app)
//                 .get('/v1/applications/'+actorId)
//                 .end((err, res) => {
//                     expect(res).to.have.status(404);

//                     if (err) done(err);
//                     else done();
//                 });
//         });
//     });

//     describe('PUT applications/:applicationsId', () => {
//         it('should return status code 200', done => {
//             chai
//                 .request(app)
//                 .put('/v1/applications/'+applicationId)
//                 .send({
//                     "idExplorer": actorId,
//                     "keyWord": "Dijon",
//                     "priceMin": 250,
//                     "priceMax": 600,
//                     "dateMin": "2020-02-12",
//                     "dateMax": "2020-02-28"
//                 })
//                 .end((err, res) => {
//                     expect(res).to.have.status(200);
//                     expect(res.body.idExplorer).to.equals(actorId);
//                     expect(res.body.keyWord).to.equals("Dijon");
//                     expect(res.body.priceMin).to.equals(250);
//                     expect(res.body.priceMax).to.equals(600);

//                     if (err) done(err);
//                     else done();
//                 });
//         });

//         it('should return status code 500', done => {
//             chai
//                 .request(app)
//                 .put('/v1/applications/'+applicationId)
//                 .send({
//                     "keyWord": 45,
//                     "priceMin": "Sevilla",
//                     "priceMax": 400,
//                     "dateMin": "2020-02-12",
//                     "dateMax": "2020-02-28"
//                 })
//                 .end((err, res) => {
//                     expect(res).to.have.status(500);

//                     if (err) done(err);
//                     else done();
//                 });
//         });

//         it('should return status code 404', done => {
//             chai
//                 .request(app)
//                 .put('/v1/applications/'+actorId)
//                 .send({
//                     "idExplorer": actorId,
//                     "keyWord": "Dijon",
//                     "priceMin": 250,
//                     "priceMax": 600,
//                     "dateMin": "2020-02-12",
//                     "dateMax": "2020-02-28"
//                 })
//                 .end((err, res) => {
//                     expect(res).to.have.status(404);

//                     if (err) done(err);
//                     else done();
//                 });
//         });
//     });

//     describe('DELETE applications/:applicationsId', () => {
//         it('should return status code 204', done => {
//             chai
//                 .request(app)
//                 .delete('/v1/applications/'+applicationId)
//                 .end((err, res) => {
//                     expect(res).to.have.status(204);

//                     if (err) done(err);
//                     else done();
//                 });
//         });

//         it('should return status code 204', done => {
//             chai
//                 .request(app)
//                 .delete('/v1/applications/'+applicationId)
//                 .end((err, res) => {
//                     expect(res).to.have.status(204);

//                     if (err) done(err);
//                     else done();
//                 });
//         });
//     });
});