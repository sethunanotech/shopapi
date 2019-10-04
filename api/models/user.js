const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const securityConfig = require('../../utils/config/security');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    },
    passwordSalt: {
        type: String,
        required: true
    }
});

userSchema.methods.hashPassword = function(plainTextPassword, callback){
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt){
        bcrypt.hash(plainTextPassword, salt, function(err, hash){
            callback(hash, salt, err);
        });
    });
}

module.exports = mongoose.model('User', userSchema);