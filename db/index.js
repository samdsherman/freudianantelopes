var mysql = require('mysql');

var Sequelize = require('sequelize');
var db = new Sequelize('antelopes', 'root', '');

// Update user and password to fit your system
var dbConnection = mysql.createConnection({
	host: 'young-depths-20298.herokuapp.com',
	user: 'root',
	password: 'antelopes',
	database: 'antelopes'
});

module.exports.dbConnection = dbConnection;
