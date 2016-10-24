var express = require('express');
var bodyParser = require('body-parser');
var db = require('./../db/index.js');

var app = express();

app.use(bodyParser.json());

// app.use(
// 	//endpoint, router
// 	);

app.get('/', function(req, res) {
	db.dbConnection.connect(function(err) {

    if(err) {
      console.log('this err: ', err);
      return;
    }
    console.log('Database connection established'); 
  })
  var obj = {username: 'clark', password: 'hello'}
  db.dbConnection.query('INSERT INTO users SET ?', obj);
  // db.dbConnection.end(function(err) {

  // });
})

app.listen(3000, function() {
	console.log('Listening on 3000');
});


module.exports = app;