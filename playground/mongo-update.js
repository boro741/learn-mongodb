// const MongoClient = require('mongodb').MongoClient;
// Using object destructuring:
const {MongoClient , ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    db.collection('Users').findOneAndUpdate({
        _id: ObjectID("5a28048585baa49dfc1bd018")
    }, {
        $set :{
            name: 'Pavan'
        },
        $inc: {
            age: 1
        }
    },{
        // It means we get new object back or returned.
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });


   // db.close();
});