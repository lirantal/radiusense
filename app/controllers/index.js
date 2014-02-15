'use strict';

var mongoose = require('mongoose'),
    Servers = mongoose.model('Servers'),
    _ = require('lodash');

exports.render = function(req, res) {

	Servers.loadSingle(req.user._id, function(err, server) {

		res.render('index', {
	    	user: function user() {
	    		return req.user ? JSON.stringify(req.user) : 'null'
	    	},
	    	serverId: server._id.toString(),
	    	server: server
    	})
	})
};
