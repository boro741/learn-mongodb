const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            // (Or)
            // validator: function(value){
            //     return validator.isEmail(value);
            // },
            message: '{VALUE} is not a valid email'
        } 
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


// How does toJSON working without calling?
// toJSON inbuilt method of mongoose.
// it let us display only the properties we want it 
// to display to the user. 
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    
    return _.pick(userObject, ['_id', 'email']);
}; 



// Creating a method - generateAuthToken
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access,token});

    return user.save().then( () => {
        return token;
    });
};


UserSchema.statics.findByToken = function (token){
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'abc123');
    } catch (e){
        return Promise.reject();
    }

    // Note: Quotes are required when you want to query 
    // properties in nested objects.
    return User.findOne({
        '_id': decoded._id, // quote not required for _id.
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

var User = mongoose.model('User', UserSchema );

module.exports = {User};