var request = require('request');
var db = require('../../db');
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var parseInstagramHTML = function(username, callback) {
  console.log('username: ', username);
  var link = 'https://www.instagram.com/' + username + '/?hl=en';
  var parsedData = [];
  request({ uri: link}, function(error, response, html) {
    if(error) {
      console.log(error)
    }

    var index = html.indexOf('window._sharedData'), index2;
    html = html.slice(index, html.length);
    index = html.indexOf('<');
    index2 = html.indexOf('{')
    html = html.slice(index2, index - 1);
    html = JSON.parse(html)

    html.entry_data.ProfilePage[0].user.media.nodes.forEach(function(post) {
      var obj = {};
      obj.contentType = 'picture';
      obj.profilePic = html.entry_data.ProfilePage[0].user.profile_pic_url;
      obj.postPic = post.display_src;
      obj.postContent = post.caption;
      obj.groupMemberName = html.entry_data.ProfilePage[0].user.username;
      obj.timeStamp = post.date;
      obj.service = 'Instagram';
      obj.linkToPost = 'https://www.instagram.com/p/' + post.code + '/?taken-by=' + html.entry_data.ProfilePage[0].user.username
      obj.likes = post.likes.count;
      obj.numberComments = post.comments.count;
      parsedData.push(obj)
    })
    callback(parsedData);
  })
};

var parseTwitterAPI = function(twitterHandle, callback) {
  if (twitterHandle.charAt(0) === '@') {
    twitterHandle = twitterHandle.slice(1);
  }
  var link = 'https://api.twitter.com/1.1/statuses/user_timeline.json\?count\=3\&screen_name\=' + twitterHandle;
  // For security, we should clean this up later
  request({
    method: 'GET',
    uri: link,
    headers: {Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAABJLxgAAAAAAaKdnMoTibNMo2hcO%2BgAc07BbXDc%3DZ39HjkTrdPf7H3EHVeH6x8XKNKJiFAxJmvqaNMhzQDyK64vJNC'}
  }, function(err, apiResponse) {
    if (err) {
      console.log('could not call twitter api', err);
    }
    apiResponse = JSON.parse(apiResponse.body);

    var parsedResponses = [];

    for (var i = 0; i < apiResponse.length; i++) {
      parsedResponses[i] = {};

      parsedResponses[i].profilePic = apiResponse[i].user.profile_image_url_https;
      parsedResponses[i].postContent = apiResponse[i].text;
      parsedResponses[i].contentType;
      parsedResponses[i].groupMemberName = '<user defined name for group member>';
      parsedResponses[i].timeStamp = apiResponse[i].created_at;
      parsedResponses[i].service = 'Twitter';
      parsedResponses[i].linkToPost = 'https://twitter.com/' + apiResponse[i].user.screen_name + '/status/' + apiResponse[i].id_str;
      parsedResponses[i].retweetCount = apiResponse[i].retweet_count;
      parsedResponses[i].likes = apiResponse[i].favorite_count;
      parsedResponses[i].numberComments;
    }
    callback(parsedResponses);
  });
};

var memberIdFinder = function(memberArray, index, req, groupId, res) {
  if (index < memberArray.length) {
    //check if member already in DB
    db.dbConnection.query('SELECT id FROM members WHERE (name, facebook, instagram, twitter) = (?, ?, ?, ?)', [ memberArray[index], req.body.members[memberArray[index]].facebook, req.body.members[memberArray[index]].instagram, req.body.members[memberArray[index]].twitter ], function(err, memberId) {
      var memberId = memberId;
      if (err) {
        console.log('err in member query', err);
      } 
      //member not in DB
      if (memberId.length === 0) {
        //insert member into members table
        db.dbConnection.query('INSERT INTO members SET ?', { name: memberArray[index], facebook: req.body.members[memberArray[index]].facebook, instagram: req.body.members[memberArray[index]].instagram, twitter: req.body.members[memberArray[index]].twitter }, function(err) {
          if (err) {
            console.log('err in members db', err);
          } else {
            //query for member_id
            db.dbConnection.query('SELECT id FROM members WHERE (name, facebook, instagram, twitter) = (?, ?, ?, ?)', [ memberArray[index], req.body.members[memberArray[index]].facebook, req.body.members[memberArray[index]].instagram, req.body.members[memberArray[index]].twitter ], function(err, idForMember) {
              if (err) {
                console.log('error in members query', err);
              }
              memberId = idForMember;
              //add member and group to join table
               db.dbConnection.query('INSERT INTO groups_members SET ?', { group_id: groupId, member_id: memberId[0].id }, function(err, results) {
                 if (err) {
                   console.log('we made it this far, what happened?');
                 }
                 memberIdFinder(memberArray, index + 1, req, groupId, res);
              });
            });          
          }
        });
      //member already in DB  
      } else {
        //add member and group to join table
        db.dbConnection.query('INSERT INTO groups_members SET ?', { group_id: groupId, member_id: memberId[0].id }, function(err, results) {
          if (err) {
            console.log('we made it this far, what happened?');
          }
          memberIdFinder(memberArray, index + 1, req, groupId, res);
        });
      }
    });
  } else {
    res.end();
  }
};


module.exports = {
  pages: {
    get: function(req, res) {
      var responseObj = {}

      var url = req.url.slice(7);
      var username = url.slice(0, url.indexOf('/'));
      var groupName = url.slice(username.length + 1);
      responseObj.group = groupName;
      responseObj.members = [];

      db.dbConnection.query("SELECT * FROM members WHERE id IN (SELECT member_id FROM groups_members WHERE group_id = (SELECT id FROM groups WHERE name = ? AND user_id = (SELECT id FROM users WHERE username = ?)));", [groupName, username], function(err, memberInformation) {
        if (err) {
          console.log('could not find the group member names', err);
        }

        var socialMediaCompiler = function(memberInformation, index, req, res) {
          if (index < memberInformation.length) {
            var memberObj = {};
            memberObj.name = memberInformation[index].name;

            // call to instagram
            parseInstagramHTML(memberInformation[index].instagram, function(instagramData) {
              memberObj.instagram = instagramData;

              // call to twitter
              parseTwitterAPI(memberInformation[index].twitter, function(twitterData) {
                memberObj.twitter = twitterData;
      
                responseObj.members.push(memberObj);
                socialMediaCompiler(memberInformation, index + 1, req, res);
              });
            })
                  // call to facebook
                    // recursive call to socialMediaCompiler
          }

          else {
            res.end(JSON.stringify(responseObj));
          }
        }

        socialMediaCompiler(memberInformation, 0, req, res)
      });
    },
    post: function(req, res) {
      //check if username in DB
      db.dbConnection.query('SELECT id FROM users WHERE username = ?', [req.body.username], function(err, userId) {
        //username in DB
        if (userId.length > 0) {
          //make sure user does not already have this group
          //query for group_id
          db.dbConnection.query('SELECT id FROM groups WHERE (user_id, name) = (?, ?)', [ userId[0].id, req.body.groupName ], function(err, groupId) {
            var groupId = groupId;
            if (err) {
              console.log('error in group query', err);
            }

            if (groupId.length === 0) {
              //insert group into groups table
              db.dbConnection.query('INSERT INTO groups SET ?', { user_id: userId[0].id, name: req.body.groupName }, function(err) {
                if (err) {
                  console.log('err in groups db', err);
                } else {
                  //query for group_id
                  db.dbConnection.query('SELECT id FROM groups WHERE (user_id, name) = (?, ?)', [ userId[0].id, req.body.groupName ], function(err, idForGroup) {
                    if (err) {
                      console.log('error in groups query', err);
                    }
                    groupId = idForGroup;

                    //for each member in group
                    var memberContainerArray =[]
                    for (var member in req.body.members) {
                      memberContainerArray.push(member);
                    }

                    memberIdFinder(memberContainerArray, 0, req, groupId[0].id, res);
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
      //find userId
      db.dbConnection.query('SELECT id FROM users WHERE username = ?', [req.body.username], function(err, userId) {
        if (err) {
          console.log('error finding user: ', err);
        } 
        //username in db
        if (userId.length > 0) {
          //update groupName
          db.dbConnection.query('UPDATE groups SET name = ? WHERE name = ?', [req.body.newGroupName, req.body.oldGroupName],function(err) {
            if (err) {
              console.log('error updating group name: ', err);
            }
            //find groupId
            db.dbConnection.query('SELECT id FROM groups WHERE name = ?', [req.body.newGroupName], function(err, groupId) {
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

                memberIdFinder(memberContainerArray, 0, req, groupId[0].id, res);
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
      if (req.body.newUser === true) {
        db.dbConnection.query('SELECT * FROM users WHERE username = ?', [req.body.username], function(err, results) {
          if (results.length === 0) {
            db.dbConnection.query("INSERT INTO users SET ?", { username: req.body.username, password: req.body.password }, function(err) {
              if (err) {
                res.writeHead(404, headers);
                res.end();
              } else {
                res.writeHead(200, headers);
                res.end(JSON.stringify(req.body.username));
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
      var username = req.url.slice(7);
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



