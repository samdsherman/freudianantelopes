var models = require('../../db/models/index.js');

module.exports = {

  pages: {
    get: function(req, res) {
      models.pages.get(req, res);
    },
    post: function(req, res) {
      models.pages.post(req, res);
    },
    put: function(req, res) {
      models.pages.put(req, res);
    }
  },

  users: {
    post: function(req, res) {
      models.users.post(req, res);
    },
    get: function(req, res) {
      models.users.get(req, res);
    }
  }
};