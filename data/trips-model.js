const generate = require('nanoid/generate');
const dateFormat = require('dateformat');

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
        chance: 'guid'
    },
    ticker: {
        function: function() {
            var date=dateFormat(new Date(), "yymmdd");
            return [date, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-');
        }
    },
    name: {
        function: function() {
            return this.faker.name.firstName() + " " + this.faker.name.lastName();
        }
    },
    title: {
        faker: 'lorem.sentence'
    }, description: {
        faker: 'lorem.paragraph'
    }, requirements: [{
        faker: 'lorem.words',
        length: 3,
        fixedLength: false
    }], start: {
        faker: 'date.past'
    }, end: {
        faker: 'date.future'
    }, pictures: [{
        function: function() {
            var buffer = []
            for(i = 0; i < this.chance.integer({"min": 10, "max":100}); i++) {
                buffer.push(this.faker.lorem.words(this.chance.integer({"min": 1, "max":5})).hexEncode());
            }
            return buffer;
        },
        length: 4,
        fixedLength: false     
    }], stages: [{
        function: function() {
            return {
                title: {faker: 'lorem.sentence'},
                description: { faker: 'lorem.paragraph'},
                price: { function: function() {
                    return this.chance.integer({"min": 0, "max": 1500});
                }}
            };
        },
        length: 4,
        fixedLength: false
    }
], managerId: {
        function: function() {
            while((actor = this.faker.random.arrayElement(this.db.actors)).role != "Manager") {}
            return actor._id;
        }
    },
    __v: {
        static: 0
    }
}