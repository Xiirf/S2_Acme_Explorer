var bcrypt = require('bcrypt');
const mongoose = require('mongoose');

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

module.exports = {
    _id: {
        function: function() {
            var id = new mongoose.Types.ObjectId();
            while(this.db.sponsorships.find(s => s._id === id)){
                id = new mongoose.Types.ObjectId();
            }
            return id;
        }
    },
    banner: {
        function: function() {
            var buffer = []
            for(i = 0; i < this.chance.integer({"min": 10, "max":100}); i++) {
                buffer.push(this.faker.lorem.words(this.chance.integer({"min": 1, "max":5})).hexEncode());
            }
            return buffer;
        }
    },
    link: {
        function: function() {
            return "https://" + this.faker.lorem.words(1) + ".com";
        }
    },
    price: {
        function: function() {
            return this.chance.integer({"min": 1000, "max": 999999999}) / 100;
        }
    },
    payed: {
        values: [true, false, false, false, false]
    },
    sponsor_id: {
        function: function() {
            while((actor = this.faker.random.arrayElement(this.db.actors)).role != "Sponsor") {}
            return actor._id;
        }
    },
    trip_id: {
        function: function() {
            return this.faker.random.arrayElement(this.db.trips)._id;
        }
    },
    createdAt: {
        faker: 'date.past'
    },
    __v: {
        static: 0
    }
};