const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5a2917d05b58bbd93bc57078';

if( !ObjectID.isValid(id)){
    console.log('ID not valid!');
}

Todo.findById(id).then( (todo) => {
    if(!todo){
        return console.log('Id not found.');
    }
    console.log('Todo By Id',todo);
}).catch((e) => console.log(e));