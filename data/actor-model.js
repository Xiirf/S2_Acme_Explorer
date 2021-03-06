var bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const RandExp = require('randexp');

module.exports = {
    _id: {
        function: function() {
            var id = new mongoose.Types.ObjectId();
            while(this.db.actors.find(actor => actor._id === id)){
                id = new mongoose.Types.ObjectId();
            }
            return id;
        }
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
        function: function() {
            var email = new RandExp(/^\w{1,3}([\.-]?\w{1,3}){2,15}@\w+([\.-]?\w{1,3}){2,5}(\.\w{2,3}){1,2}$/).gen();
            while(this.db.actors.find(actor => actor.email === email)){
                email = new RandExp(/^\w{1,3}([\.-]?\w{1,3}){2,15}@\w+([\.-]?\w{1,3}){2,5}(\.\w{2,3}){1,2}$/).gen();
            }
            return email;
        }
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
    address: {
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