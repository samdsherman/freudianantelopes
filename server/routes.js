var controller = require('./controllers/index.js');
var router = require('express').Router();

router.get('/pages*', controller.pages.get);

router.post('/pages*', controller.pages.post);

router.put('/pages*', controller.pages.put);

router.post('/users*', controller.users.post);

module.exports.router;