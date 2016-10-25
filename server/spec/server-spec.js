/* Need to have sql and node running for these tests */

var mysql = require('mysql');
var request = require('request');
var expect = require('chai').expect;

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
        console.log(res.body);
        expect(res.statusCode).to.equal(404);
        done();  
      });
    });
  });
  
  it('Should write groups to db for a given user', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/pages/warriors',
        json: { 
              username: 'Clark', 
              groupName: 'warriors', 
              members: {
                            'Stephen Curry': {
                                                twitter: '@StephenCurry30', 
                                                facebook: 'StephenCurryOfficial', 
                                                instagram: 'stephencurry30'}
                                              }
                          }
      }, () => {
        var queryString = 'SELECT * FROM groups';

        dbConnection.query(queryString, (err, results) => {
          // Should have one result
          expect(results.length).to.equal(1);

          done();  
        });  
      });
    })
    });

});