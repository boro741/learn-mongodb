require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Connecting to Mongoose DB.
// As I'm importing the same mongoose variable 
// I don't need to import again mongoose.
var {mongoose} = require('./db/mongoose');
var {Todo,test} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

var port = process.env.PORT || 3000; 

// Giving the body json to the express
// i.e it converts the json into object and 
// attach it to the req .
app.use(bodyParser.json()); // Takes the JSON and returns function.


//test();

app.post('/user', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });

/* app.post('/user', (req,res) => {

    // req.body is the body attached by bodyParser.
    console.log(req.body);

    var body = _.pick(req.body, ['email','password']);

    var user = new User(body);


    user.save().then( () => {
        return user.generateAuthToken();
    }).then( (token) => {
        // Custom header.
        res.header('x-auth',token).send(user);
    }, (e) => {
        res.status(400).send(e);
    });

   /*  user.save().then( (doc) => {
        // After saving then sending 
        // back the response to the client.
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
}); */



app.get('/user/me',authenticate, (req,res) => {
    res.send(req.user);
});

app.get('/user', (req,res) => {
    
    User.find().then( (user)=>{
        res.send({user});
    }, (err)=>{
        res.status(400).send(err);
    });

}); 

app.get('/user/:id', (req,res)=>{
    var id = req.params.id;

    if( !ObjectID.isValid(id)){
        return res.status(404).send();
    }

    User.findById(id).then( (user)=> {

        if(!user){
           return res.status(404).send();
        }

        // I'm using ES6 syntax - {user}
        // As {user: user} same.
        // So I'm sending a object with user property.
        res.send({user});
    }).catch((err)=>{
        return res.status(400).send(); // Remove .send(err) caz it can contain some private info.
    });

});



app.delete('/user/:id', (req,res) => {
    var id = req.params.id;
   
   if( !ObjectID.isValid(id)){
       return res.status(404).send();
   }


   User.findByIdAndRemove(id).then( (user) => {
        if( !user ){
            return res.status(404).send();
        }

        console.log('Deleted:',user);
        res.send(user);
   }).catch( (e) => {
       res.status(400).send();
   });
});

// Update User.
app.patch('/user/:id', (req,res) => {
    var id = req.params.id;
    // Pick the email property from request body.
    var body = _.pick(req.body, ['email']);

    if( !ObjectID.isValid(id)){
        return res.status(404).send();
    }


    User.findByIdAndUpdate(id , { $set: body}, {new: true})
    .then( (user) => {
        if( !user ){
            return res.status(404).send();
        }

        res.send({user});
    })
    .catch( (e) => {
        res.status(400).send();
    });

});

// For Todo
// app.patch('/todo/:id', (req,res) => {
//     var id = req.params.id;
//     // Pick the email property from request body.
//     var body = _.pick(req.body, ['text', 'completed']);

//     if( !ObjectID.isValid(id)){
//         return res.status(404).send();
//     }

//     if(_.isBoolean(body.completed) && body.completed){
//         body.completedAt = new Date().getTime();
//     } else{
//         body.completed = false;
//         body.completedAt = null;
//     }

//     Todo.findByIdAndUpdate(id , { $set: body}, {new: true})
//         .then( (todo) => {
//             if( !todo ){
//                 return res.status(404).send();
//             }

//             res.send({todo});
//         })
//         .catch( (e) => {
//             res.status(400).send();
//         });
    
// });

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
}