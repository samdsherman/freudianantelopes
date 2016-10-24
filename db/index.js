var mysql = require('mysql');

var Sequelize = require('sequelize');
var db = new Sequelize('localhost', 'root', '') // <-- look up in docs

dbConnection = mysql.createConnection({
	hosts: 'localhost'
	user: 'root',
	password: '',
	database: 'sampleDB'
});

exports.Users = db.define('users', {
	// table schema
}, {
	timestamps: false
}
);

exports.Groups = db.define('groups', {
	// table schema
}, {
	timestamps: false
}
);

exports.Members = db.define('members', {
	// table schema
}, {
	timestamps: false
}
);


module.exports.dbConnection = dbConnection;