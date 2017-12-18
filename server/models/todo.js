var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
    text: {
        // Validators.
        type: String,
        required: true,
        trim: true,
        minlenght: 1
    },
    completed: {
        type: Boolean,
        default: false
    }, 
    completedAt: {
        type: Number,
        default: null
    }
});


// function for testing the object destructuring.
function test(){
    console.log('Test');
}

module.exports = {Todo,test};