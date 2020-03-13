const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
GlobalVars = mongoose.model('GlobalVars');

const { expect } = chai;
chai.use(chaiHttp);

describe('Integration tests', () => {
    var resPost;

    var getFunc = (done, callback) => chai
        .request(app)
        .get('/v1/globalVars')
        .send()
        .end((err, res) => {
            if (err) {
                done(err);
            } 
            else {
                callback(res);
                done();
            }
        })
    
    var handleFlatRateFunc = (done, patch, callback) => chai
        .request(app)
        .patch('/v1/sponsorships/flatRate')
        .send(patch)
        .end((err, res) => {
            if (err) {
                done(err);
            } 
            else {
                callback(res);
                done();
            }
        })

    // var handleTimeOutResultsFunc = (done, patch, callback) => chai
    //     .request(app)
    //     .patch('/v1/finders/flatRate')
    //     .send(patch)
    //     .end((err, res) => {
    //         if (err) {
    //             done(err);
    //         } 
    //         else {
    //             callback(res);
    //             done();
    //         }
    //     })

    // var handleMaxNumberResults = (done, patch, callback) => chai
    //     .request(app)
    //     .patch('/v1/sponsorships/flatRate')
    //     .send(patch)
    //     .end((err, res) => {
    //         if (err) {
    //             done(err);
    //         } 
    //         else {
    //             callback(res);
    //             done();
    //         }
    //     })

    before((done) => {
        GlobalVars.collection.deleteMany({}, () => {
            done();
        });
    });

    describe('GET GlobalVars', () => {
        it('should return status code 200', done => {
            getFunc(done, res => expect(res).to.have.status(200));
        });
        it('should return the global variables', done => {
            getFunc(done,
                res => expect(res.body.flatRateSponsorships).to.eql(GlobalVars.schema.path('flatRateSponsorships').defaultValue)
                && expect(res.body.cacheTimeOutFinderResults).to.eql(GlobalVars.schema.path('cacheTimeOutFinderResults').defaultValue)
                && expect(res.body.maxNumberFinderResults).to.eql(GlobalVars.schema.path('maxNumberFinderResults').defaultValue)
            );
        });
    });

    describe('PATCH Sponsorships flatRate', () => {
        var correctPatch = {
            "flatRateSponsorships": 50,
        };
        var wrongPatch = {
            "flatRateSponsorships": -50
        };
        it('should return status code 200', done => {
            handleFlatRateFunc(done, correctPatch, res => expect(res).to.have.status(200));
        });
        it('should return the right banned actor', done => {
            handleFlatRateFunc(done, correctPatch,  res => expect(res.body.flatRateSponsorships).to.eql(50));
        });
        it('should return status code 422', done => {
            handleFlatRateFunc(done, wrongPatch, res => expect(res).to.have.status(422));
        });
    });

    // describe('PATCH Finders TimeOutResults', () => {
    //     var correctPatch = {
    //         "cacheTimeOutFinderResults": 50,
    //     };
    //     var wrongPatch = {
    //         "cacheTimeOutFinderResults": -50
    //     };
    //     it('should return status code 200', done => {
    //         handleTimeOutResultsFunc(done, correctPatch, res => expect(res).to.have.status(200));
    //     });
    //     it('should return the right banned actor', done => {
    //         handleTimeOutResultsFunc(done, correctPatch,  res => expect(res.body.cacheTimeOutFinderResults).to.eql(50));
    //     });
    //     it('should return status code 422', done => {
    //         handleTimeOutResultsFunc(done, wrongPatch, res => expect(res).to.have.status(422));
    //     });
    // });

    // describe('PATCH Finders MaxNumberResults', () => {
    //     var correctPatch = {
    //         "maxNumberFinderResults": 50,
    //     };
    //     var wrongPatch = {
    //         "maxNumberFinderResults": -50
    //     };
    //     it('should return status code 200', done => {
    //         handleMaxNumberResults(done, correctPatch, res => expect(res).to.have.status(200));
    //     });
    //     it('should return the right banned actor', done => {
    //         handleMaxNumberResults(done, correctPatch,  res => expect(res.body.maxNumberFinderResults).to.eql(50));
    //     });
    //     it('should return status code 422', done => {
    //         handleMaxNumberResults(done, wrongPatch, res => expect(res).to.have.status(422));
    //     });
    // });

    after((done) => {
        GlobalVars.collection.deleteMany({}, () => {
            GlobalVars.findOneAndUpdate({}, {}, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }, (err, glob) => done());
        });
    });
})