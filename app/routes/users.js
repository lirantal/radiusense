'use strict';

// User routes use users controller
var users = require('../controllers/users');
var flash = require('connect-flash');
var authorization = require('./middlewares/authorization');

// User authorization helpers
var hasAuthorization = function(req, res, next) {
  if (req.profile.id != req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(app, passport) {

  // User sign-in
  app.get('/users/signin', authorization.requiresAnonymous, users.signin);
  // User sign-in action - setting the local strategy route
  app.post('/users/signin', passport.authenticate('local', {
    failureRedirect: '/users/signin',
    failureFlash: true
  }), users.session);
  
  // User sign-out
  app.get('/users/signout', users.signout);

  // User sign-up
  app.get('/users/signup', authorization.requiresAnonymous, users.signup);
  app.post('/users/signup', authorization.requiresAnonymous, users.create);

  app.get('/users/me', users.me);

  // Setting up the userId param
  app.param('userId', users.user);

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
}), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

};