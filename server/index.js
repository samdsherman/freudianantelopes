var express = require('express');
var bodyParser = require('body-parser');
var db = require('./../db/index.js');
var controller = require('./controllers/index.js');

// var router = require('./routes.js');

var app = express();


app.use(express.static(__dirname + '/../client'));

app.use(bodyParser.json());

app.get('/pages*', controller.pages.get);

app.post('/pages*', controller.pages.post);

app.put('/pages*', controller.pages.put);

app.get('/users*', controller.users.post); //update to POST for front-end integration


app.listen(3000, function() {
	console.log('Listening on 3000');
});


module.exports = app;