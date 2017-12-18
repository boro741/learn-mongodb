const express = require('express');
const bodyParser = require('body-parser');

// Connecting to Mongoose DB.
// As I'm importing the same mongoose variable 
// I don't need to import again mongoose.
var {mongoose} = require('./db/mongoose');
var {Todo,test} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// Giving the body json to the express
// i.e it converts the json into object and 
// attach it to the req .
app.use(bodyParser.json()); // Takes the JSON and returns function.


//test();

app.post('/user', (req,res) => {

    // req.body is the body attached by bodyParser.
    console.log(req.body);

    var user = new User({
        email: req.body.email
    });


    user.save().then( (doc) => {
        // After saving then sending 
        // back the response to the client.
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/user', (req,res) => {
    
    User.find().then( (user)=>{
        res.send({user});
    }, (err)=>{
        res.status(400).send(err);
    });

});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {
    app
}