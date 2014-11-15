'use strict';

module.exports = function(app) {  

  // Home page controller
  var index = require('../../app/controllers/index.server.controller');
  // Users authorization related controllers
  var users = require('../../app/controllers/users.server.controller');

  app.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
      res.redirect('/users/signin');
    } else {
      index.render(req, res, next);
    }
  });

  app.route('/users/signin').get(function (req, res) {
    res.render('users/signin', {
      title: 'Sign in'
    });
  });

  app.route('/users/signup').get(function (req, res) {
    res.render('users/signup', {
      title: 'Sign Up'
    });
  });
  
};
