var mocker = require('mocker-data-generator').default
var fs = require('fs');

var actor = require('./actor-model.js');
var sponsorship = require('./sponsorship-model.js');

mocker()
.schema('actors', actor, 10000)
.schema('sponsorships', sponsorship, 10000)
.build(function(error, data) {
    if (error) {
        console.error(error);
    } else {
        var emails = data.actors.map(actor => actor.email);
        data.actors = data.actors.filter((v, i, a) => emails.indexOf(v.email) === i); //Remove emails duplicates
        console.log(data.actors.length + " actors generated");
        console.log(data.sponsorships.length + " sponsorships generated");
        fs.writeFileSync('data.json', JSON.stringify(data));
    }
})