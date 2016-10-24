var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

// app.use(
// 	//endpoint, router
// 	);

app.get('/', function(req, res) {
	res.send('hello there');
})

app.listen(3000, function() {
	// res.send('Hello world');
	console.log('Listening on 3000');
});


module.exports = app;