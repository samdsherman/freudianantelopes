var db = require('../../db');
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

module.exports = {
  pages: {
    get: function(req, res) {
      
    },
    post: function(req, res) {
      // findUserId
        // insertIntoGroups
          // pass along group_id
        // insertIntoMembers
          // pass along member_id
        // addToJoinTable  
    },
    put: function(req, res) {
      
    }
  },

  users: {
    post: function(req, res) {
      if (req.body.newUser === true) {
        db.dbConnection.query('SELECT * FROM users WHERE username = ?', [req.body.username], function(err, results) {
          if (results.length === 0) {
            db.dbConnection.query("INSERT INTO users SET ?", { username: req.body.username, password: req.body.password }, function(err) {
              if (err) {
                res.writeHead(404, headers);
                res.end();
              } else {
                console.log('user added');
                res.writeHead(200, headers);
                res.end();
              }
            })
          } else {
            console.log('user already exists');
            // add logic for notifying user later
            res.writeHead(404, headers);
            res.end();
          }
        });
      } else {
        db.dbConnection.query("SELECT id FROM users WHERE username = '" + req.body.username + "' &&  password = '" + req.body.password + "';", function(err, results) {
        // db.dbConnection.query( "SELECT id FROM users WHERE username = 'clark' && password = 'hello';", function(err, rows, fields) {
          if (err) {
            console.log('error finding user: ', err);
            res.writeHead(404, headers);
            res.end();
          } else if (results.length === 0) {
            res.writeHead(404, headers);
            res.end();
          } else {
            res.writeHead(200, headers);
            res.end(JSON.stringify(results));
            // send back cookie or token?
          }
        });
      }
    }
  }

};