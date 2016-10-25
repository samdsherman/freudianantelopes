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
      
    },
    put: function(req, res) {
      
    }
  },

  users: {
    post: function(req, res) {
      if (req.body.newUser === true) {
        db.dbConnection.query("INSERT INTO users SET ?", { username: req.body.username, password: req.body.password }, function(err, res) {
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
        db.dbConnection.query("SELECT id FROM users WHERE username = '" + req.username + "' &&  password = '" + req.password + "';", function(err, rows, fields) {
        // db.dbConnection.query( "SELECT id FROM users WHERE username = 'clark' && password = 'hello';", function(err, rows, fields) {
          if (err) {
            res.writeHead(404, headers);
            res.end();
          } else {
            res.writeHead(200, headers);
            res.end();
            // send back cookie or token?
          }
        });
      }
    }
  }

};