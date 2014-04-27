'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Servers = mongoose.model('Servers'),
    _ = require('lodash');

var radiusClient = require('./radius');

/**
 * Iterate the servers collection and trigger statistics harvesting
 * for each server
 */
exports.harvest = function(req, res, next) {
    Servers.find({}).exec(function(err, servers){
        servers.forEach(function(server) {
            radiusClient.StatusPing(server);
        });
    });
    next();
}


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
    // and if so then we don't allow them to create another server instance.
    // Also validate and confirm that the user can't add an entry for an
    // already created IP address as this could be then spoofed or used for
    // DOS attacks
    Servers.findOne(
        {
            $or: [
                {"user" : req.user.id},
                {"radius.address": server.radius.address}
            ]
            
        }
        ).exec(function(err, serverFound) {
        if (err)
            res.jsonp(
                500,
                {"error" : "unable to fetch database records"}
            );
        else if (serverFound) {
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

    Servers.findOne(
        {
            $and: [
                {"user" : { $ne: req.user.id } },
                {"radius.address": server.radius.address}
            ]
        }
        ).exec(function(err, serverFound) {
        if (err)
            res.jsonp(
                500,
                {"error" : "unable to fetch database records"}
            );
        else if (serverFound) {
            res.jsonp(
                500,
                {"error" : "you are only allowed to create one server instance of the same radius address"}
            );
        } else {
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