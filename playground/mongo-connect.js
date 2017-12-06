// const MongoClient = require('mongodb').MongoClient;
// Using object destructuring:
const {MongoClient , ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    //     }, (err,result) => {
    //         if(err)
    //             return console.log('Unable to insert todo',err);
            
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     });

    db.collection('Users').insertOne({
            name: 'Pavan',
            age: 20,
            location: 'Hyd'
        }, (err,result) => {
            if(err)
                return console.log('Unable to insert todo',err);

            console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined,2));
        });


    db.close();
});