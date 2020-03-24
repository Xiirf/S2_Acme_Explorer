const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
POIs = mongoose.model('POIs');

const { expect } = chai;
chai.use(chaiHttp);

describe('POIs Integration tests', () => {
    var poiId = null;

    before((done) => {
        POIs.collection.deleteMany({});

        done();
    });

    after((done) => {
        POIs.collection.deleteMany({});

        done();
    })

    describe('POST pois', () => {
        it('should return status code 201', done => {
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
                    expect(res).to.have.status(201);
                    expect(res.body.title).to.equals("A title");
                    expect(res.body.description).to.equals("A description");
                    expect(res.body.coordinates).to.equals("18°N ...");
                    expect(res.body.type).to.equals("Restaurant");

                    if (err) {
                        done(err);
                    }
                    else {
                        poiId = res.body._id;
                        done();
                    }
                });
        });

        it('should return status code 422', done => {
            chai
                .request(app)
                .post('/v1/pois')
                .send({
                    "description": "A description",
                    "coordinates": "18°N ...",
                    "type": "Restaurant"
                })
                .end((err, res) => {
                    expect(res).to.have.status(422);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('GET pois', () => {
        it('should return status code 200', done => {
            chai
                .request(app)
                .get('/v1/pois')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equals(1);
                    expect(res.body[0].title).to.equals("A title");

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('GET pois/:poiId', () => {
        it('should return status code 200', done => {
            chai
                .request(app)
                .get('/v1/pois/'+poiId)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.title).to.equals("A title");

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .get('/v1/pois/5e78f25eda231f2a183daafd')
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('PUT pois/:poiId', () => {
        it('should return status code 200', done => {
            chai
                .request(app)
                .put('/v1/pois/'+poiId)
                .send({
                    "title": "New title",
                    "description": "New description",
                    "coordinates": "19°N ...",
                    "type": "Pub"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.title).to.equals("New title");
                    expect(res.body.description).to.equals("New description");
                    expect(res.body.coordinates).to.equals("19°N ...");
                    expect(res.body.type).to.equals("Pub");

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 404', done => {
            chai
                .request(app)
                .put('/v1/pois/5e78f25eda231f2a183daafd')
                .send({
                    "title": "New title",
                    "description": "New description",
                    "coordinates": "19°N ...",
                    "type": "Pub"
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);

                    if (err) done(err);
                    else done();
                });
        });
    });

    describe('DELETE pois/:poisId', () => {
        it('should return status code 204', done => {
            chai
                .request(app)
                .delete('/v1/pois/'+poiId)
                .end((err, res) => {
                    expect(res).to.have.status(204);

                    if (err) done(err);
                    else done();
                });
        });

        it('should return status code 204', done => {
            chai
                .request(app)
                .delete('/v1/pois/'+poiId)
                .end((err, res) => {
                    expect(res).to.have.status(204);

                    if (err) done(err);
                    else done();
                });
        });
    });
});