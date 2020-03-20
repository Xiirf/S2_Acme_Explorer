var mocker = require('mocker-data-generator').default
var fs = require('fs');

var actor = require('./actor-model.js'),
sponsorship = require('./sponsorship-model.js'),
trips = require('./trips-model.js'),
application = require('./application-model.js'),
finder = require('./finder-model.js');

mocker()
.schema('actors', actor, 1000)
.schema('trips', trips, 1000)
.schema('sponsorships', sponsorship, 1000)
.schema('applications', application, 1000)
.schema('finders', finder, 1000)
.build(function(error, data) {
    if (error) {
        console.error(error);
    } else {
        var idExplorer = new Array();
        var finders = new Array()

        data.trips.forEach(trip => {
            trip.price = 0;
            trip.stages.forEach((stage => {
                trip.price += stage.price;
            }))
        });

        data.finders.forEach(finder => {
            if (!idExplorer.includes(finder.idExplorer)) {
                idExplorer.push(finder.idExplorer);
                finders.push(finder);
            }
        });
        data.finders = finders;
        
        fs.writeFileSync('dataActors.json', JSON.stringify(data.actors));
        fs.writeFileSync('dataTrips.json', JSON.stringify(data.trips));
        fs.writeFileSync('dataSponsorships.json', JSON.stringify(data.sponsorships));
        fs.writeFileSync('dataApplications.json', JSON.stringify(data.applications));
        fs.writeFileSync('dataFinders.json', JSON.stringify(data.finders));

        console.log(data.actors.length + " actors generated");
        console.log(data.trips.length + " trips generated");
        console.log(data.sponsorships.length + " sponsorships generated");
        console.log(data.applications.length + " applications generated");
        console.log(data.finders.length + " finders generated");
    }
})