var express = require('express');
var bodyParser = require('body-parser');
var db = require('./../db/index.js');
var controller = require('./controllers/index.js');

var app = express();


app.use(express.static(__dirname + '/../client'));

app.use(bodyParser.json());

// Get all posts from a user's group
app.get('/pages*', controller.pages.get);

// Store a new group and it's members to database
app.post('/pages*', controller.pages.post);

// Update an existing group and it's members in databases
app.put('/pages*', controller.pages.put);

// Signup and Login users
app.post('/users*', controller.users.post);

// Retrieve a user's groups
app.get('/users*', controller.users.get);

app.listen(8000, function() {
	console.log('Listening on 8000');
});


module.exports = app;