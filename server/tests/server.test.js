const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');


const users = [{
    _id: new ObjectID(),
    email: 'boro@gmail.com'
},{
    _id: new ObjectID(),
    email: 'narzary@gmail.com'
}];

// used before each test case.
beforeEach( function(done){
    // Remove all the users from database.
    User.remove({})
        .then( function(){
            return User.insertMany(users);
        })
        .then( function(){
            done();
        });
});

describe('PATCH /user/:id', function(){
    it('Should update a user', function(done){
        var hexId = users[0]._id.toHexString();
        var email = 'test@gmail.com';



        request(app)
            .patch(`/user/${hexId}`)
            .send({
                email
            })
            .expect(200)
            .expect( function(res){
                expect(res.body.user.email).toBe(email)
            })
            .end(done);
    })
});



describe('POST /user', function(){
    it('Should create a new user ', function(done){
        var email = 'pavanboro14@gmail.com';

        request(app)
            // Sending post reqest
            .post('/user')
            .send({email})
            // Testing status
            .expect(200)
            // Testing the body that comes back from database.
            .expect( function(res){
                expect(res.body.email).toBe(email)
            })
            // Testing more deeply - text
            .end( function(err,res){
                if(err){
                    return done(err);
                }

                User.find({email}).then( function(users){
                    expect(users.length).toBe(1);
                    expect(users[0].email).toBe(email);
                    done();
                }).catch( function(e){
                    done(e);
                });
            });
    });

    it('Should not create user with invalid body data', function(done){
        request(app)
            .post('/user')
            .send({})
            .expect(400)
            .end( function(err,res){
                if(err){
                    return done(err);
                }

                User.find().then( function(users){
                    expect(users.length).toBe(2);
                    done();
                }).catch( function(e){
                    return done(e);
                });
            });
    });
});



// Here I'm deleting all the db and 
// then adding the dummy data
// and test the my dummy data length returned
// to be true.
describe('GET /user', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/user')
        .expect(200)
        .expect((res) => {
            // connected to app.get('/user') in server.js
          expect(res.body.user.length).toBe(2);
        })
        .end(done);
    });
});




// toHexString() - return the ObjectID id as a 24 byte hex string representation
describe('GET /todos/:id', () => {
    it('should return user doc', (done) => {
      request(app)
        .get(`/user/${users[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user.email).toBe(users[0].email);
        })
        .end(done);
    });
  
    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString();
  
      request(app)
        .get(`/user/${hexId}`)
        .expect(404)
        .end(done);
    });
  
    it('should return 404 for non-object ids', (done) => {
      request(app)
        .get('/user/123abc')
        .expect(404)
        .end(done);
    });
  });


  describe('DELETE /user/:id', function(){
    it('should remove a user', function(done){
        var hexId = users[0]._id.toHexString();

        request(app)
            .delete(`/user/${hexId}`)
            .expect(200)
            .expect( (res) => {
                expect(res.body._id).toBe(hexId);
                
            })
            .end( (err,res) => {
                if(err){
                    return done(err);
                }

                User.findById(hexId).then( (user) => {
                    
                    expect(user).toNotExist();
                    done();
                })
                .catch( (e) => {
                    return done(e);
                });
            });
    });

    it('should return 404 if user not found', function(done){
        request(app)
            .delete('/user/5a39edb1fd599614005ea0ac')
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is not valid', function(done){
        request(app)
            .delete('/user/1234')
            .expect(404)
            .end(done);
    })
});