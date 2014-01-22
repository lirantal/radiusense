'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Servers = mongoose.model('Servers'),
    _ = require('lodash');

/**
 * Find server by id
 */
exports.server = function(req, res, next, id) {
    Servers.load(id, function(err, server) {
        if (err) return next(err);
        if (!server) return next(new Error('Failed to load server ' + id));
        req.server = server;
        next();
    });
};

/**
 * Create a radius dashboard instance
 */
exports.create = function(req, res) {
    var server = new Servers(req.body);
    server.user = req.user;
  
    // Make sure the user has already at least one entry in the database
    // and if so then we don't allow them to create another server instance
    Servers.findOne({"user" : req.user.id}).exec(function(err, server) {
        if (err)
            res.jsonp(
                500,
                {"error" : "unable to fetch database records"}
            );
        else if (server) {
            res.jsonp(
                500,
                {"error" : "you are only allowed to create one server instance"}
            );
        } else {
            server.save(function(err) {
                if (err) {
                    res.jsonp({"error": "unable to save server entry"});
                } else {
                    res.jsonp(server);
                }
            });
        }
    });
};

/**
 * Update a radius dashboard instance
 */
exports.update = function(req, res) {
    var server = req.server;

    server = _.extend(server, req.body);

    server.save(function(err) {
        if (err) {
            return res.jsonp(
                500,
                {"error": err.message}
            );
        } else {
            res.jsonp(server);
        }
    });
};

/**
 * Delete a radius dashboard instance
 */
exports.delete = function(req, res) {
    var server = req.server;

    server = _.extend(server, req.body);

    server.remove(function(err) {
        if (err) {
            return res.jsonp(
                500,
                {"error": err.message}
            );
        } else {
            res.jsonp(server);
        }
    });
};

/**
 * List of Servers
 * @todo for the time being return only one configured server
 */
exports.all = function(req, res) {
    Servers.findOne({"user" : req.user.id}).sort('-created').populate('user', 'name username').exec(function(err, dashboards) {
        if (err) {
            return res.jsonp(
                500,
                {"error": err.message}
            );
        } else {
            res.jsonp(dashboards);
        }
    });
};