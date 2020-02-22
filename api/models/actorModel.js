var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

/**
 * @swagger
 *  components:
 *    schemas:
 *      actor:
 *        allOf:
 *        - type: object
 *          properties:
 *            _id:
 *              type: string
 *            name:
 *              type: string
 *            surname:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *            phone:
 *              type: string
 *            address:
 *              type: string
 *            role:
 *              type: string
 *              enum: [Administrator, Manager, Explorer, Sponsor]
 *            banned:
 *              type: boolean
 *            created_at:
 *              type: string
 *            __v:
 *              type: integer
 */
var actorModel = new Schema({
    name: {
        type: String,
        required: 'Enter the name of the actor please'
    }, surname: {
        type: String,
        required: 'Enter the surname of the actor please'
    }, email: {
        type: String,
        required: 'Enter the email of the actor please',
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }, password: {
        type: String,
        required: 'Enter the password of the actor please'
    }, adress: {
        type: String
    }, phone: {
        type: String
    }, role: {
        type: String,
        required: 'Enter the role(s) of the actor please',
        enum: ['Administrator', 'Manager', 'Explorer', 'Sponsor']
    }, banned: {
        type: Boolean,
        default: false
    }, createdAt: {
        type:Date,
        default: Date.now
    }
}, {
    strict: false
})



actorModel.pre('save', function(callback) {
    var actor = this;
    // Break out if the password hasn't changed
    if (!actor.isModified('password')) return callback();
    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);
        bcrypt.hash(actor.password, salt, function(err, hash) {
            if (err) return callback(err);
            actor.password = hash;
            callback();
        });
    });
});

  
actorModel.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        console.log('verifying password in actorModel: '+password);
        if (err) return cb(err);
        console.log('iMatch: '+isMatch);
        cb(null, isMatch);
    });
};
  

module.exports = mongoose.model ('Actors', actorModel);