// My guess for using var for mongoose is 
// I'm assigning it the Promise.
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
}