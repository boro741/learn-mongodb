var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

var app = express();

// Allow to parse JSON elements.
app.use(bodyParser.json());
// urlencoded will allow us to get and receive
// elements through the url. So that we could use 
// with POSTMAN.
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/TodoApp');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1 
    }
});

app.get('/', function(req,res){
    res.send('Hello');
});

app.get('/user',function(req,res){
    User.find({})
        .then( function(result){
            console.log(JSON.stringify(result,undefined,2));
            res.json(result);
        }, function(err){
            res.send(err);
        });
});

// Finding by ID.
app.get('/user/:id', function(req,res){
    User.findOne({
        _id: req.params.id
    }).then( function(result){
        console.log(JSON.stringify(result,undefined,2));
        res.json(result);
    }, function(err){
        res.send(err);
    });
});

app.post('/user', function(req,res){
    console.log(req.body);

    var user = new User({
        email: req.body.email
    });

    user.save().then( (doc)=> {
        res.send(doc);
    }, (err)=>{
        res.status(400).send(e);
    });
});

// Updating.
app.put('/user/:id', function(req,res){
    
    /* User.findOneAndUpdate({_id: req.params.id },
        {
            $set: {email: req.body.email},
        },{
            new: true
        })
        .then((user) => {
            if (!user) {
                return res.status(404).send();
            }
    
        res.send({user});
      }).catch((e) => {
        res.status(400).send();
      }); */
    
    /* User.findOneAndUpdate( {
        _id: req.params.id
    }, {
        $set: {email: req.body.email}
    },{
        upsert: true, new: true
    }, function(err,doc){
        if(err){
            console.log('Error Occured.');
        }
           
        console.log(doc);
        res.send(doc);
        
     }); */

     User.findOneAndUpdate({
        _id: req.params.id
        },
        { $set: { email: req.body.email }
      }, {upsert: true}, function(err, user) {
        if (err) {
          res.send('error updating ');
        } else {
          console.log(user);
          res.send(user);
        }
      });
});




app.listen(3000, ()=>{
    console.log('Running on port 3000');
});