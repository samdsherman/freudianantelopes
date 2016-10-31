var request = require('request');
var db = require('../index.js');
var Parse = require('../controllers/parsers.js');
var Queries = require('../controllers/queries.js');

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
      var parsedURL = Parse.parseURL(req.url);
      var username = decodeURI(parsedURL.username);
      var groupName = decodeURI(parsedURL.groupName);
      var responseObj = { group: groupName, members: [] };

      db.dbConnection.query("SELECT * FROM members WHERE id IN (SELECT member_id FROM groups_members WHERE group_id = (SELECT id FROM groups WHERE name = ? AND user_id = (SELECT id FROM users WHERE username = ?)));", [groupName, username], function(err, groupMemberAccountInformation) {
        if (err) {
          console.log('could not find the group member names', err);
        }

        var socialMediaCompiler = function(groupMemberAccountInformation, index, req, res) {
          if (index < groupMemberAccountInformation.length) {
            var memberObj = {};
            var groupMemberName = groupMemberAccountInformation[index].name
            memberObj.name = groupMemberName;
            memberObj.instagramHandle = groupMemberAccountInformation[index].instagram;
            memberObj.twitterHandle = groupMemberAccountInformation[index].twitter;

            // call to instagram
            Parse.parseInstagramHTML(groupMemberAccountInformation[index].instagram, groupMemberName, function(instagramData) {
              memberObj.instagram = instagramData;

              // call to twitter
              Parse.parseTwitterAPI(groupMemberAccountInformation[index].twitter, groupMemberName, function(twitterData) {
                memberObj.twitter = twitterData;
      
                responseObj.members.push(memberObj);
                socialMediaCompiler(groupMemberAccountInformation, index + 1, req, res);
              });
            })
                  // call to facebook
                    // recursive call to socialMediaCompiler
          } else {
            res.end(JSON.stringify(responseObj));
          }
        }
        socialMediaCompiler(groupMemberAccountInformation, 0, req, res)
      });
    },

    post: function(req, res) {
      var username = req.body.username;
      //check if username in DB
      db.dbConnection.query('SELECT id FROM users WHERE username = ?', [username], function(err, userId) {
        //username in DB
        if (userId.length > 0) {
          //decode groupName
          var groupName = req.body.groupName;
          //query for group_id
          db.dbConnection.query('SELECT id FROM groups WHERE (user_id, name) = (?, ?)', [ userId[0].id, groupName ], function(err, groupId) {
            var groupId = groupId;
            if (err) {
              console.log('error in group query', err);
            }

            if (groupId.length === 0) {
              //insert group into groups table
              db.dbConnection.query('INSERT INTO groups SET ?', { user_id: userId[0].id, name: groupName }, function(err) {
                if (err) {
                  console.log('err in groups db', err);
                } else {
                  //query for group_id
                  db.dbConnection.query('SELECT id FROM groups WHERE (user_id, name) = (?, ?)', [ userId[0].id, groupName ], function(err, idForGroup) {
                    if (err) {
                      console.log('error in groups query', err);
                    }
                    groupId = idForGroup;

                    //for each member in group
                    var memberContainerArray =[]
                    for (var member in req.body.members) {
                      memberContainerArray.push(member);
                    }

                    Queries.memberIdFinder(memberContainerArray, 0, groupId[0].id, req, res);
                  });
                }
              });
            } else {
              console.log('group already exists');
              res.writeHead(404, headers);
              res.end();
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
      var username = req.body.username;
      //find userId
      db.dbConnection.query('SELECT id FROM users WHERE username = ?', [username], function(err, userId) {
        if (err) {
          console.log('error finding user: ', err);
        } 
        //username in db
        if (userId.length > 0) {
          //decode groupName
          var newGroupName = req.body.newGroupName;
          var oldGroupName = req.body.oldGroupName;
          //update groupName
          db.dbConnection.query('UPDATE groups SET name = ? WHERE name = ?', [newGroupName, oldGroupName],function(err) {
            if (err) {
              console.log('error updating group name: ', err);
            }
            //find groupId
            db.dbConnection.query('SELECT id FROM groups WHERE name = ?', [newGroupName], function(err, groupId) {
              if (err) {
                console.log('error finding group id: ', err);
              }
              //remove all groupId rows from join table
              db.dbConnection.query('DELETE FROM groups_members WHERE group_id = ?', [groupId[0].id], function(err) {
                if (err) {
                  console.log('error removing group ids: ', err);
                }

                //for each member in group
                var memberContainerArray =[]
                for (var member in req.body.members) {
                  memberContainerArray.push(member);
                }

                Queries.memberIdFinder(memberContainerArray, 0, groupId[0].id, req, res);
              });
            });
          });
          
        //username not in db
        } else {
          console.log('user does not exist');
          res.writeHead(404, headers);
          res.end();
        }
      });
    }
  },

  users: {
    post: function(req, res) {
      var username = req.body.username;
      var password = req.body.password;
      if (req.body.newUser === true) {
        db.dbConnection.query('SELECT * FROM users WHERE username = ?', [username], function(err, results) {
          if (results.length === 0) {
            db.dbConnection.query("INSERT INTO users SET ?", { username: username, password: password }, function(err) {
              if (err) {
                res.writeHead(404, headers);
                res.end();
              } else {
                res.writeHead(200, headers);
                res.end(JSON.stringify(username));
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
        db.dbConnection.query("SELECT id FROM users WHERE username = '" + username + "' &&  password = '" + password + "';", function(err, results) {
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
    },

    get: function(req, res) {
      var username = decodeURI(req.url.slice(7));
      db.dbConnection.query('SELECT name FROM groups WHERE user_id = (SELECT id FROM users WHERE username = ?);', [username], function(err, results) {
        if (err) {
          console.log('could not find user\'s groups', err);
          res.writeHead(404, headers);
          res.end();
        } else {
          for (var i = 0; i < results.length; i++) {
            results[i] = results[i].name;
          }
          res.writeHead(200, headers);
          res.end(JSON.stringify(results));
        }
      });
    }
  }

};
