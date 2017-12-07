const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// Giving the body json to the express
app.use(bodyParser.json());

app.post('/user', (req,res) => {
    console.log(req.body);

    var user = new User({
        email: req.body.email
    });

    user.save().then( (doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});