var request = require('request');
var db = require('../index.js');

var memberIdFinder = function(groupMembers, index, groupId, req, res) {
  if (index < groupMembers.length) {
    var facebookHandle = decodeURI(req.body.members[groupMembers[index]].facebook);
    var instagramHandle = decodeURI(req.body.members[groupMembers[index]].instagram);
    var twitterHandle = decodeURI(req.body.members[groupMembers[index]].twitter);
    //check if member already in DB
    db.dbConnection.query('SELECT id FROM members WHERE (name, facebook, instagram, twitter) = (?, ?, ?, ?)', [ groupMembers[index], facebookHandle, instagramHandle, twitterHandle ], function(err, memberId) {
      var memberId = memberId;
      if (err) {
        console.log('err in member query', err);
      } 
      //member not in DB
      if (memberId.length === 0) {
        //insert member into members table
        db.dbConnection.query('INSERT INTO members SET ?', { name: groupMembers[index], facebook: facebookHandle, instagram: instagramHandle, twitter: twitterHandle }, function(err) {
          if (err) {
            console.log('err in members db', err);
          } else {
            //query for member_id
            db.dbConnection.query('SELECT id FROM members WHERE (name, facebook, instagram, twitter) = (?, ?, ?, ?)', [ groupMembers[index], facebookHandle, instagramHandle, twitterHandle ], function(err, idForMember) {
              if (err) {
                console.log('error in members query', err);
              }
              memberId = idForMember;
              //add member and group to join table
               db.dbConnection.query('INSERT INTO groups_members SET ?', { group_id: groupId, member_id: memberId[0].id }, function(err, results) {
                 if (err) {
                   console.log('we made it this far, what happened?');
                 }
                 memberIdFinder(groupMembers, index + 1, groupId, req, res);
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
          memberIdFinder(groupMembers, index + 1, groupId, req, res);
        });
      }
    });
  } else {
    res.end();
  }
};

exports.memberIdFinder = memberIdFinder;