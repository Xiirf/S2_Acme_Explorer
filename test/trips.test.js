const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
Actors = mongoose.model('Actors'),
POIs = mongoose.model('POIs'),
Trips = mongoose.model('Trips');
Stages = mongoose.model('Stages');

const { expect } = chai;
chai.use(chaiHttp);

describe('Trips Integration tests', () => {
    var actorId = null;
    var tripId = null;
    var stageId = null;
    var poiId = null;

    before((done) => {
        Actors.collection.deleteMany({});
        Trips.collection.deleteMany({});
        POIs.collection.deleteMany({});

        chai
            .request(app)
            .post('/v1/actors')
            .send({
                "name": "FlavienTest",
                "surname": "XiirfTest",
                "email": "flavien@testManager.com",
                "phone": "012459786",
                "password": "pwd",
                "address": "algun lugar",
                "role": "Manager"
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } 
                else {
                    actorId = res.body._id;
                    chai
                        .request(app)
                        .post('/v1/pois')
                        .send({
                            "title": "A title",
                            "description": "A description",
                            "coordinates": "18°N ...",
                            "type": "Restaurant"
                        })
                        .end((err, res) => {
                            if (err) {
                                done(err);
                            }
                            else {
                                poiId = res.body._id;
                                done();
                            }
                        });
                }
            });
    });

    describe('POST Trips', () => {
        it('should return status code 201', done => {
            chai
                .request(app)
                .post('/v1/trips')
                .send({
                    "title": "titleTrip",
                    "description": "descTrip",
                    "requirementes": [
                      "testReq"
                    ],
                    "start": "2020-02-14",
                    "end": "2020-04-20",
                    "stages": [{
                      "title": "testExample",
                      "description": "desExample",
                      "price": 250
                    },
                    {
                        "title": "testExample2",
                        "description": "desExample2",
                        "price": 251
                    }],
                    "managerId": actorId
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.managerId).to.equals(actorId);
                    expect(res.body.price).to.equals(501);

                    if (err) {
                        done(err);
                    }
                    else {
                        tripId = res.body._id;
                        done();
                    }
                });
        });

        it('should return status code 422', done => {
            chai
                .request(app)
                .post('/v1/trips')
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
    
    describe('GET trips', () => {
        it('should return status code 200', done => {
            chai
                .request(app)
                .get('/v1/trips')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equals(1);
                    expect(res.body[0].managerId).to.equals(actorId);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('GET trips/:tripsID', () => {
        it('should return status code 200', done => {
            chai
                .request(app)
                .get('/v1/trips/'+tripId)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.managerId).to.equals(actorId);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .get('/v1/trips/'+actorId)
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });
    
    describe('PUT trips/:tripsID', () => {
        it('should return status code 500', done => {
            chai
                .request(app)
                .put('/v1/trips/'+tripId)
                .send({
                    "price": "test"
                })
                .end((err, res) => {
                    expect(res).to.have.status(500);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 200', done => {
            chai
                .request(app)
                .put('/v1/trips/'+tripId)
                .send({
                    "title": "titleTripUpdated",
                    "published": true
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.title).to.equals("titleTripUpdated");
                    expect(res.body.published).to.be.true;
                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 414', done => {
            chai
                .request(app)
                .put('/v1/trips/'+tripId)
                .send({
                    "title": "titleTripUpdated"
                })
                .end((err, res) => {
                    expect(res).to.have.status(414);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .put('/v1/trips/'+actorId)
                .send({
                    "title": "titleTripUpdated"
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });
    
    describe('DELETE trips/:tripsId', () => {
        it('should return status code 414', done => {
            chai
                .request(app)
                .delete('/v1/trips/'+tripId)
                .end((err, res) => {
                    expect(res).to.have.status(414);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 201', done => {
            chai
                .request(app)
                .post('/v1/trips')
                .send({
                    "title": "titleTrip",
                    "description": "descTrip",
                    "requirementes": [
                      "testReq"
                    ],
                    "start": "2020-02-14",
                    "end": "2020-04-20",
                    "stages": [{
                      "title": "testExample",
                      "description": "desExample",
                      "price": 250
                    },
                    {
                        "title": "testExample2",
                        "description": "desExample2",
                        "price": 251
                    }],
                    "managerId": actorId
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.managerId).to.equals(actorId);
                    expect(res.body.price).to.equals(501);

                    if (err) {
                        done(err);
                    }
                    else {
                        tripId = res.body._id;
                        done();
                    }
                });
        });

        it('should return status code 204', done => {
            chai
                .request(app)
                .delete('/v1/trips/'+tripId)
                .end((err, res) => {
                    expect(res).to.have.status(204);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .delete('/v1/trips/'+tripId)
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('PATCH /trips/{tripId}/cancel', () => {
        it('should return status code 201', done => {
            chai
                .request(app)
                .post('/v1/trips')
                .send({
                    "title": "titleTrip",
                    "description": "descTrip",
                    "requirementes": [
                      "testReq"
                    ],
                    "start": Date() + 1,
                    "end": Date() + 2,
                    "stages": [{
                      "title": "testExample",
                      "description": "desExample",
                      "price": 250
                    },
                    {
                        "title": "testExample2",
                        "description": "desExample2",
                        "price": 251
                    }],
                    "managerId": actorId
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.managerId).to.equals(actorId);
                    expect(res.body.price).to.equals(501);

                    if (err) {
                        done(err);
                    }
                    else {
                        tripId = res.body._id;
                        done();
                    }
                });
        });
        
        it('should return status code 200', done => {
            chai
                .request(app)
                .patch('/v1/trips/'+tripId+'/cancel')
                .send({
                    "reasonCancelling": "reason1"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.reasonCancelling).to.equals('reason1');
                    expect(res.body.cancelled).to.be.true;

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 422', done => {
            chai
                .request(app)
                .patch('/v1/trips/'+tripId+'/cancel')
                .send({
                    "reasonCancelling": "reason1"
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 422', done => {
            chai
                .request(app)
                .patch('/v1/trips/'+tripId+'/cancel')
                .end((err, res) => {
                    expect(res).to.have.status(422);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .get('/v1/trips/'+actorId)
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('PATCH /trips/:tripId/stages/:stageId/pois/:poiId', () => {
        it('should return status code 201', done => {
            chai
                .request(app)
                .post('/v1/trips')
                .send({
                    "title": "titleTrip",
                    "description": "descTrip",
                    "requirementes": [
                      "testReq"
                    ],
                    "start": Date() + 1,
                    "end": Date() + 2,
                    "stages": [{
                      "title": "testExample",
                      "description": "desExample",
                      "price": 250
                    },
                    {
                        "title": "testExample2",
                        "description": "desExample2",
                        "price": 251
                    }],
                    "managerId": actorId
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.managerId).to.equals(actorId);
                    expect(res.body.price).to.equals(501);

                    if (err) {
                        done(err);
                    }
                    else {
                        tripId = res.body._id;
                        stageId = res.body.stages[0]._id;
                        done();
                    }
                });
        });

        it('should return status code 200', done => {
            chai
                .request(app)
                .patch('v1/trips/'+tripId+'/stages/'+stageId+'/pois/'+poiId)
                .send()
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 422', done => {
            chai
                .request(app)
                .patch('v1/trips/'+tripId+'/stages/'+stageId+'/pois/'+actorId)
                .send()
                .end((err, res) => {
                    expect(res).to.have.status(422);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .get('v1/trips/'+actorId+'/stages/'+stageId+'/pois/'+poiId)
                .send()
                .end((err, res) => {
                    console.log(err);
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('PATCH /trips/{tripId}/stage', () => {
        it('should return status code 201', done => {
            chai
                .request(app)
                .post('/v1/trips')
                .send({
                    "title": "titleTrip",
                    "description": "descTrip",
                    "requirementes": [
                      "testReq"
                    ],
                    "start": Date() + 1,
                    "end": Date() + 2,
                    "stages": [{
                      "title": "testExample",
                      "description": "desExample",
                      "price": 250
                    },
                    {
                        "title": "testExample2",
                        "description": "desExample2",
                        "price": 251
                    }],
                    "managerId": actorId
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.managerId).to.equals(actorId);
                    expect(res.body.price).to.equals(501);

                    if (err) {
                        done(err);
                    }
                    else {
                        tripId = res.body._id;
                        done();
                    }
                });
        });
        
        it('should return status code 200', done => {
            chai
                .request(app)
                .patch('/v1/trips/'+tripId+'/stage')
                .send({
                    "stages": [{
                        "title": "testExample",
                        "description": "desExample",
                        "price": 250
                      },
                      {
                        "title": "testExample",
                        "description": "desExample",
                        "price": 253
                      }]
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.price).to.equals(1004);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 422', done => {
            chai
                .request(app)
                .patch('/v1/trips/'+tripId+'/stage')
                .send({
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .get('/v1/trips/'+actorId)
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });

    after((done) => {
        Actors.collection.deleteMany({});
        Trips.collection.deleteMany({});
        done();
    });

})
