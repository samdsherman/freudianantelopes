var mysql = require('mysql');

var Sequelize = require('sequelize');
var db = new Sequelize('antelopes', 'root', '') // <-- look up in docs

var dbConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'antelopes'
});


// @ Will - I think this logic is repetitive given our shema.sql document
// exports.Users = db.define('users', {
// 	// table schema
//   id: {type: Sequelize.INTEGER, primaryKey: true},
//   username: Sequelize.STRING,
//   password: Sequelize.STRING
// }, {
// 	timestamps: false
// });

// exports.Groups = db.define('groups', {
// 	// table schema
// 	id: {type: Sequelize.INTEGER, primaryKey: true},
// 	user_id: Sequelize.INTEGER,
// 	name: Sequelize.STRING
// }, {
// 	timestamps: false
// });

// exports.Members = db.define('members', {
// 	// table schema
// 	id: {type: Sequelize.INTEGER, primaryKey: true},
// 	name: Sequelize.STRING,
// 	facebook: Sequelize.STRING,
// 	instagram: Sequelize.STRING,
// 	twitter: Sequelize.STRING
// }, {
// 	timestamps: false
// });


module.exports.dbConnection = dbConnection;