var request = require('request');
var db = require('../../db');

var memberIdFinder = function(memberArray, index, groupId, req, res) {
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
                 memberIdFinder(memberArray, index + 1, groupId, req, res);
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
          memberIdFinder(memberArray, index + 1, groupId, req, res);
        });
      }
    });
  } else {
    res.end();
  }
};

exports.memberIdFinder = memberIdFinder;