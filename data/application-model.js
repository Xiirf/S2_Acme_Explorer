module.exports = {
    _id: {
        chance: 'guid'
    },
    idExplorer: {
        function: function() {
            while((actor = this.faker.random.arrayElement(this.db.actors)).role != "Explorer") {}
            return actor._id;
        }
    },
    idTrip: {
        function: function() {
            return this.faker.random.arrayElement(this.db.trips)._id;
        }
    },
    createdAt: {
        faker: 'date.past'
    },
    status: {
        values: ['REJECTED', 'PENDING', 'DUE', 'ACCEPTED', 'CANCELLED']
    },
    comments: [{
        faker: 'lorem.words',
        length: 3,
        fixedLength: false
    }],
    reasonCancelling: {
        faker: 'lorem.paragraph'
    },
    __v: {
        static: 0
    }
}