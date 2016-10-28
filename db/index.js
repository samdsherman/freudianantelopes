var mysql = require('mysql');

var Sequelize = require('sequelize');
var db = new Sequelize('antelopes', 'root', '');

var dbConnection = mysql.createConnection({
	host: 'young-depths-20298.herokuapp.com',
	user: 'root',
	password: '',
	database: 'antelopes'
});

module.exports.dbConnection = dbConnection;