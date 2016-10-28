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
      uri: 'http://127.0.0.1:8000/users/clark',
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

  it('Should insert multiple users into the table', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/users/will',
        json: { username: 'Will', password: 'abc123', newUser: true }
      }, () => {

        var queryString = 'SELECT * FROM users';

        dbConnection.query(queryString, (err, results) => {
          expect(results.length).to.equal(2);
          expect(results[1].username).to.equal('Will');
          done();
        });
      });
    });
  });

  it('Should not insert duplicate usernames into the users table', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/users/clark',
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
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/users/clark',
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
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/users/clark',
        json: { username: 'Clark', password: 'insecure', newUser: false }
      }, (err, res) => {
        expect(res.statusCode).to.equal(404);
        done();  
      });
    });
  });
  
  it('Should write groups to database for a given user', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/clark/warriors',
        json: specTestData.clarkWarriors
    }, () => {

        var queryString = 'SELECT * FROM groups';

        dbConnection.query(queryString, (err, results) => {
          expect(results.length).to.equal(1);
          expect(results[0].name).to.equal('Warriors');
          done();
        });
      });
    })
  });

  it('Should accomodate spaces in group names', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/clark/warriors',
        json: specTestData.clarkEncoded
    }, () => {

        var queryString = 'SELECT * FROM groups';

        dbConnection.query(queryString, (err, results) => {
          expect(results.length).to.equal(1);
          expect(results[0].name).to.equal('Warrior$ Basketball');
          done();
        });
      });
    })
  });

  it('Should write members to database when supplied a group', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/clark/warriors',
        json: specTestData.clarkWarriors
    }, () => {

        var queryString = 'SELECT name FROM members';

        dbConnection.query(queryString, (err, results) => {
          expect(results.length).to.equal(3);
          expect(results[0].name).to.equal('Stephen Curry');
          expect(results[2].name).to.equal('Other Guy');
          done();
        });
      });
    })
  });

  it('Should not write to database if the user is not in the database', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/pages/will/warriors',
      json: specTestData.willWarriors
    }, (err, res) => {
      expect(res.statusCode).to.equal(404);
      done();
    });
  });

  it('Should find all members of a user\'s group', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/will',
      json: { username: 'Will', password: 'abc123', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/will/warriors',
        json: specTestData.willWarriors
      }, () => {
        var queryString = 'SELECT * FROM members';

        dbConnection.query(queryString, (err, results) => {
          expect(results.length).to.equal(3);
          expect(results[0].name).to.equal('Stephen Curry');
          expect(results[1].instagram).to.equal('Green23');
          expect(results[2].twitter).to.equal('@guy');
          done();
        });
      });
    });
  });

  it('Should not add new members when supplied with identical information', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/users/will',
        json: { username: 'Will', password: 'abc123', newUser: true }
      }, () => {
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:8000/pages/clark/warriors',
          json: specTestData.clarkWarriors
        }, () => {
          request({
            method: 'POST',
            uri: 'http://127.0.0.1:8000/pages/will/warriors',
            json: specTestData.willWarriors
          }, () => {
            var queryString = 'SELECT * FROM members';

            dbConnection.query(queryString, (err, results) => {
              expect(results.length).to.equal(3);
              done();
            });
          });
        });
      });
    });
  });

  it('Should modify a member\'s information when given a PUT request', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/will',
      json: { username: 'Will', password: 'abc123', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/will/warriors',
        json: specTestData.willWarriors
      }, () => {
        request({
          method: 'PUT',
          uri: 'http://127.0.0.1:8000/pages/will/warriors',
          json: specTestData.willWarriorsModify
        }, () => {
          var queryString = "SELECT twitter FROM members WHERE name = 'Stephen Curry'";

          dbConnection.query(queryString, (err, results) => {
            expect(results[1].twitter).to.equal('@StephenCurry30000000');
            done();
          });
        });
      });
    });
  });

  it('Should update a group name when neccessary', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/will',
      json: { username: 'Will', password: 'abc123', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/will/warriors',
        json: specTestData.willWarriors
      }, () => {
        request({
          method: 'PUT',
          uri: 'http://127.0.0.1:8000/pages/will/warriors',
          json: specTestData.willWarriorsModify
        }, () => {

          var queryString = "SELECT members.twitter FROM members WHERE id IN " +
                              "(SELECT member_id FROM groups_members WHERE group_id = " +
                              "(SELECT id FROM groups WHERE name = 'BasketballTeam' AND user_id = " +
                              "(SELECT id FROM users WHERE username = 'Will')))";

          dbConnection.query(queryString, (err, results) => {
            expect(results.length).to.equal(3);
            expect(results[0].twitter).to.equal('@StephenCurry30000000');
            done();
          });
        });
      });
    });
  });

  it('Should send an array of user groups when asked', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Will', password: 'abc123', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/will/warriors',
        json: specTestData.willWarriors
      }, () => {
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:8000/pages/will/bulls',
          json: specTestData.willBulls
        }, () => {
          request({
            method: 'GET',
            uri: 'http://127.0.0.1:8000/users/will'
          }, (err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(Array.isArray(JSON.parse(res.body))).to.equal(true);
            expect(JSON.parse(res.body).length).to.equal(2);
            done();
          });
        });
      });
    });
  });

  it('Should send data in the correct format to the front-end', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/clark/warriors',
        json: specTestData.clarkWarriors
      }, () => {
        request({
          method: 'GET',
          uri: 'http://127.0.0.1:8000/pages/clark/warriors'
        }, (err, results) => {
          results = JSON.parse(results.body);
          expect(Array.isArray(results.members)).to.equal(true);
          expect(results.members[0].name).to.equal('Stephen Curry');
          expect(Array.isArray(results.members[0].instagram)).to.equal(true);
          // expect(Array.isArray(results.members[0].facebook)).to.equal(true);
          expect(Array.isArray(results.members[0].twitter)).to.equal(true);
          done();
        });
      });
    });
  });

  it('Should send empty data to front-end when given bad instagram handle instead of erroring', (done) => {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/users/clark',
      json: { username: 'Clark', password: 'secure', newUser: true }
    }, () => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/pages/clark/Warrior$%20Basketball',
        json: specTestData.clarkBadInstagram
      }, () => {
        request({
          method: 'GET',
          uri: 'http://127.0.0.1:8000/pages/clark/Warrior$%20Basketball'
        }, (err, results) => {
          results = JSON.parse(results.body);
          expect(Array.isArray(results.members)).to.equal(true);
          expect(JSON.stringify(results.members[1].instagram)).to.equal('[]');
          expect(JSON.stringify(results.members[2].instagram)).to.equal('[]');
          done();
        });
      });
    });
  });

});