// My guess for using var for mongoose is 
// I'm assigning it the Promise.
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect( process.env.MONGODB_URI);

module.exports = {
    mongoose
}