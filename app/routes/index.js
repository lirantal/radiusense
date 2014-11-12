'use strict';

module.exports = function(app, passport) {  

  // Home route
  var index = require('../controllers/index');

  app.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
      res.redirect('/users/signin');
    } else {
      index.render(req, res, next);
    }
  });
  
};
