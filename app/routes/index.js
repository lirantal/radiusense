'use strict';

module.exports = function(app) {  

  // Home page controller
  var index = require('../../app/controllers/index.server.controller');
  // Users authorization related controllers
  var users = require('../../app/controllers/users.server.controller');

  //app.route('/').get(core.index);
  app.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
      res.render('users/signin', {
      	title: 'Sign in'
      });
    } else {
      index.render(req, res, next);
    }
  });
  
};
