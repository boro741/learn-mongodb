// const MongoClient = require('mongodb').MongoClient;
// Using object destructuring:
const {MongoClient , ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a26c52c023ffe30b0689dc8')
    }) 
    .then( (result) => {
        console.log(result);
    });


   // db.close();
});