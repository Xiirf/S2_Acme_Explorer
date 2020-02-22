var bcrypt = require('bcrypt');

module.exports = {
    _id: {
        chance: 'guid'
    },
    name: {
        function: function() {
            return this.faker.name.firstName() + " " + this.faker.name.lastName();
        }
    },
    surname: {
        faker: 'lorem.words(1)'
    },
    email: {
        randexp: /^\w{1,3}([\.-]?\w{1,3}){2,15}@\w+([\.-]?\w{1,3}){2,5}(\.\w{2,3}){1,2}$/
    },
    banned: {
        values: [true, false, false, false, false]
    },
    password: {
        function: function() {
            return bcrypt.hashSync(this.faker.lorem.words(1), bcrypt.genSaltSync(5));
        }
    },
    phone: {
        function: function() {
            return "+" + this.chance.integer({"min": 1, "max": 99}) + " " + this.chance.integer({"min": 100000000, "max": 999999999});
        }
    },
    adress: {
        function: function() {
            return this.faker.address.streetAddress() + " " + this.faker.address.city() + ", " + this.casual.country;
        }
    },
    role: {
        values: ['Administrator', 'Manager', 'Explorer', 'Sponsor']
    },
    createdAt: {
        faker: 'date.past'
    },
    __v: {
        static: 0
    }
};