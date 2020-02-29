const mongoose = require('mongoose');
module.exports = {
    _id: {
        function: function() {
            var id = new mongoose.Types.ObjectId();
            while(this.db.finders.find(finder => finder._id === id)){
                id = new mongoose.Types.ObjectId();
            }
            return id;
        }
    },
    idExplorer: {
        function: function() {
            while((actor = this.faker.random.arrayElement(this.db.actors)).role != "Explorer") {}
            return actor._id;
        }
    },
    keyWord: {
        faker: 'lorem.words(1)'
    },
    priceMin: {
        function: function() {
            return this.chance.integer({"min": 1, "max": 500});
        }
    },
    priceMax: {
        function: function() {
            return this.chance.integer({"min": 500, "max": 10000});
        }
    },
    dateMin: {
        faker: 'date.past'
    },
    dateMax: {
        faker: 'date.future'
    },
    __v: {
        static: 0
    }
}