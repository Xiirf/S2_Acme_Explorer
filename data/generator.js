var mocker = require('mocker-data-generator').default
var fs = require('fs');

var actor = require('./actor-model.js'),
sponsorship = require('./sponsorship-model.js'),
trips = require('./trips-model.js'),
application = require('./application-model.js'),
finder = require('./finder-model.js');

mocker()
.schema('actors', actor, 10000)
.schema('trips', trips, 10000)
.schema('sponsorships', sponsorship, 10000)
.schema('applications', application, 10000)
.schema('finders', finder, 10000)
.build(function(error, data) {
    if (error) {
        console.error(error);
    } else {
        console.log(data.actors.length + " actors generated");
        console.log(data.trips.length + " trips generated");
        console.log(data.sponsorships.length + " sponsorships generated");
        console.log(data.applications.length + " applications generated");
        console.log(data.finders.length + " finders generated");
        fs.writeFileSync('dataActors.json', JSON.stringify(data.actors));
        data.trips.forEach(trip => {
            trip.price = 0;
            trip.stages.forEach((stage => {
                trip.price += stage.price;
            }))
        });
        fs.writeFileSync('dataTrips.json', JSON.stringify(data.trips));
        fs.writeFileSync('dataSponsorships.json', JSON.stringify(data.sponsorships));
        fs.writeFileSync('dataApplications.json', JSON.stringify(data.applications));
        fs.writeFileSync('dataFinders.json', JSON.stringify(data.finders));
    }
})