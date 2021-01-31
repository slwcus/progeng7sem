 const bcrypt = require('bcrypt');
 const SALT_WORK_FACTOR = 10;
 const mongoose = require('mongoose');
 const { Schema } = mongoose;
 
 const User = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, index: { unique: true }},
    country: {type: String, required: true},
    country_region: String,
    password: {type: String, required: true},
    role: {type: Number, required: true},
    avatar: String,
    event: {type:Schema.Types.ObjectId, ref: 'Event'},
    confirmed: Boolean,
    pin: String,
    about: String,
    register_date: Date
 });

 User.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
User.methods.comparePassword = function(candidatePassword, cb) {
    console.log(candidatePassword)
    console.log(bcrypt.compareSync(candidatePassword, this.password))
    return bcrypt.compareSync(candidatePassword, this.password)
};
 
 module.exports = mongoose.model('User', User);