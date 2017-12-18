const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {User} = require('./../models/user');


const users = [
    {email: 'boro@gmail.com'},
    {email: 'narzary@gmail.com'}
];

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
                })
            })
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