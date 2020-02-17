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
        fs.writeFileSync('data.json', JSON.stringify(data));
    }
})