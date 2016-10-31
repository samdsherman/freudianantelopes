var mysql = require('mysql');

var Sequelize = require('sequelize');
var db = new Sequelize('antelopes', 'root', '');

var dbConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'antelopes',
	database: 'antelopes'
});

module.exports.dbConnection = dbConnection;
