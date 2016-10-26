/* Need to have sql and node running for these tests */

var mysql = require('mysql');
var request = require('request');
var expect = require('chai').expect;
var specTestData = require('./spec-test-data.js');

describe('Persistent database and server communication', () => {
  var dbConnection;

  beforeEach((done) => {
    dbConnection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'antelopes'
    });
    dbConnection.connect();

    /* Empty database before each test */
    dbConnection.query('truncate users');
    dbConnection.query('truncate members');
    dbConnection.query('truncate groups');
    dbConnection.query('truncate groups_members', done);
    // done();
  });

  afterEach(() => {
    dbConnection.end();
  });

  it('Should insert users into the users table', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {

      var queryString = 'SELECT * FROM users';

      dbConnection.query(queryString, (err, results) => {
        // Should have one result
        expect(results.length).to.equal(1);
        // Expect username to be Clark
        expect(results[0].username).to.equal('Clark');

        done();
      });
    });
  });

  it('Should not insert duplicate usernames into the users table', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/users/clark',
        json: { username: 'Clark', password: 'insecure', newUser: true }
      }, () => {
        var queryString = 'SELECT * FROM users';

        dbConnection.query(queryString, (err, results) => {
          // Should have one result
          expect(results.length).to.equal(1);
          // Expect username to be Clark
          expect(results[0].username).to.equal('Clark');

          done();  
        });
      });
    });
  });

  it('Should respond with userId when username and password match on login', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/users/clark',
        json: { username: 'Clark', password: 'secure', newUser: false }
      }, (err, res) => {
        expect(res.body[0].id).to.exist;
        done(); 
      });
    });
  });

  it('Should respond with 404 when username and password do not match', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/users/clark',
        json: { username: 'Clark', password: 'insecure', newUser: false }
      }, (err, res) => {
        expect(res.statusCode).to.equal(404);
        done();  
      });
    });
  });
  
  xit('Should write groups to database for a given user', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/pages/warriors',
        json: specTestData.clarkWarriors
    }, () => {

        var queryString = 'SELECT * FROM members';

        dbConnection.query(queryString, (err, results) => {

          console.log('spec results: ', results)
          expect(results.length).to.equal(1);
          expect(results[0].twitter).to.equal('@StephenCurry30');
          done();
        });
        // dbConnection.query('SELECT * FROM groups', (err, results) => {
        //   expect(results.length).to.equal(1);
        // });
        // dbConnection.query('SELECT * FROM groups_members', (err, results) => {
        //   expect(results.length).to.equal(1);
        // });
      });
    })
  });

  xit('Should not write to database if the user is not in the database', (done) => {});

  xit('Should find all members of a user\'s group', (done) => {});

  xit('Should not add new members when supplied with identical information', (done) => {});

  xit('Should modify a member\'s information when given a PUT request', (done) => {});

  xit('Database should reply with all social media accounts for a group when given a GET request', (done) => {});

  xit('Should send data in the correct format to the front-end', (done) => {});

});