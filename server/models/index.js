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
      console.log('users post called');
      //select
      if (req.body.newUser === true) {

      } else {
        db.dbConnection.query( "SELECT id FROM users WHERE username = '" + req.username + "' &&  password = '" + req.password + "';", function(err, rows, fields) {
        // db.dbConnection.query( "SELECT id FROM users WHERE username = 'clark' && password = 'hello';", function(err, rows, fields) {

          if (err) {
            res.writeHead(404, headers);
            res.end();
          }
          res.writeHead(200, headers);
          console.log('inside users.post, here is the JSON being returned in rows: ', JSON.stringify(rows));
          res.end(JSON.stringify(rows));
        });
      }
    }
  }

};