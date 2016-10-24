var controller = require('./controllers/index.js');
var router = require('express').Router();

router.get('/pages*', controller.pages.get);

router.post('/pages*', controller.pages.post);

router.put('/pages*', controller.pages.put);

router.get('/users/clark', function() {console.log('hello')});

module.exports.router;