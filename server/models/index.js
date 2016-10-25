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
      //check if username in DB
      console.log('0fadsdfasdadfsdf', req.body.username);
      db.dbConnection.query('SELECT id FROM users WHERE username = ?', [req.body.username], function(err, userId) {
        console.log(userId);
        //username in DB
        if (userId.length > 0) {
          //make sure user does not already have this group
          //query for group_id
          console.log('groupname: ', req.body.groupName);
          db.dbConnection.query('SELECT id FROM groups WHERE (user_id, name) = (?, ?)', [ userId[0].id, req.body.groupName ], function(err, groupId) {
            var groupId = groupId;
            if (err) {
              console.log('error in group query', err);
            }

            if (groupId.length === 0) {
              //insert group into groups table
              db.dbConnection.query('INSERT INTO groups SET ?', { user_id: userId[0].id, name: req.body.groupName }, function(err) {
                if(err) {
                  console.log('err in groups db', err);
                }
              });
              //query for group_id
              db.dbConnection.query('SELECT id FROM groups WHERE (user_id, name) = (?, ?)', [ userId[0].id, req.body.groupName ], function(err, idForGroup) {
                if (err) {
                  console.log('error in groups query', err);
                }
                groupId = idForGroup;
              });
            }

          //for each member in group
          for (var member in req.body.members) {
            //check if member already in DB
            db.dbConnection.query('SELECT id FROM members WHERE (name, facebook, instagram, twitter) = (?, ?, ?, ?)', [ member, member.facebook, member.instagram, member.twitter ], function(err, memberId) {
              var memberId = memberId;
              if (err) {
                console.log('err in member query', err);
              } 

              //member not in DB
              if (memberId.length === 0) {
                //insert member into members table
                db.dbConnection.query('INSERT INTO members SET ?', { name: member, facebook: member.facebook, instagram: member.instagram, twitter: member.twitter }, function(err) {
                  if(err) {
                    console.log('err in members db', err);
                  }
                });
                //query for member_id
                db.dbConnection.query('SELECT id FROM members WHERE (name, facebook, instagram, twitter) = (?, ?, ?, ?)', [ member, member.facebook, member.instagram, member.twitter ], function(err, idForMember) {
                  if (err) {
                    console.log('error in members query', err);
                  }
                  memberId = idForMember;
                });
              }

              //add member and group to join table
              db.dbConnection.query('INSERT INTO groups_members SET ?', { group_id: groupId, member_id: memberId }, function(err, results) {
                if (err) {
                  console.log('we made it this far, what happened?');
                }

                res.end(results);
              });
            });
          }
        })
        //username not in DB
        } else {
          console.log('user does not exist');
          res.writeHead(404, headers);
          res.end();
        }
      });
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