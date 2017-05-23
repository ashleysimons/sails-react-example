import { expect, assert } from 'chai';
import request from 'supertest';

const alphaSortFunction = (a, b) => {
  if(a.email < b.email) return -1;
  if(a.email > b.email) return 1;
  return 0;
};

describe('UserController', function() {
  const userPath = '/user';
  let myRequest;

  before(function(){
    global.fixtures['user'].sort(alphaSortFunction);
  });

  describe(`GET ${userPath}`, function(){

    beforeEach(function(){
      myRequest = request(sails.hooks.http.app)
        .get(userPath)
        .set('Accept', 'application/json')
    });

    it('returns the same amount of users as in the fixtures', function(done){
      myRequest.end(function(err, res) {
        if (err) return done(err);
        expect(res.body).to.have.lengthOf(global.fixtures['user'].length);
        done();
      });
    });

    it('firstnames match the fixtures', function(done){
      myRequest.end(function(err, res) {
        if (err) return done(err);
          res.body.sort(alphaSortFunction);
          for(var i = 0; i < global.fixtures['user'].length;i++){
            expect(res.body[i].firstname).to.equal(global.fixtures['user'][i].firstname);
          }
          done();
        });
    });

    it('surnames match the fixtures', function(done){
        myRequest.end(function(err, res) {
          if (err) return done(err);
          res.body.sort(alphaSortFunction);
          for(var i = 0; i < global.fixtures['user'].length;i++){
            expect(res.body[i].surname).to.equal(global.fixtures['user'][i].surname);
          }
          done();
        });
    });

    it('emails match the fixtures', function(done){
        myRequest.end(function(err, res) {
          if (err) return done(err);
          res.body.sort(alphaSortFunction);
          for(var i = 0; i < global.fixtures['user'].length;i++){
            expect(res.body[i].email).to.equal(global.fixtures['user'][i].email);
          }
          done();
        });
    });

  });

  describe(`POST ${userPath}`, function() {

    it('should create user', function (done) {
      let firstname = 'Fred';
      let surname   = 'Bass';
      let email     = 'foo@example.com';
      let password  = 'mydemopassword';
      let terms     = 'on';
      request(sails.hooks.http.app)
        .post(userPath)
        .set('Accept', 'application/json')
        .send({ firstname: firstname, surname: surname, email: email, password: password, terms: terms })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.firstname, firstname);
          assert.equal(res.body.surname, surname);
          assert.equal(res.body.email, email);
          done();
        });
    });

  });

});