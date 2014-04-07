'use strict';

var authorization = require('./middlewares/authorization');

module.exports = function(app, passport) {
    
    // Home route
    var index = require('../controllers/index');
    app.get('/', authorization.requiresLogin, index.render);

};
