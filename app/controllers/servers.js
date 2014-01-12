'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Servers = mongoose.model('Servers'),
    _ = require('lodash');

/**
 * Create a radius dashboard instance
 */
exports.create = function(req, res) {
    var server = new Servers(req.body);
    server.user = req.user;
  
    server.save(function(err) {
        if (err) {
            res.jsonp({'error': 'something bad happened'});
        } else {
            res.jsonp(server);
        }
    });
};


/**
 * List of Articles
 */
exports.all = function(req, res) {
    Servers.find().sort('-created').populate('user', 'name username').exec(function(err, dashboards) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(dashboards);
        }
    });
};