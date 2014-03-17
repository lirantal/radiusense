'use strict';

/**
 * module dependencies
 */
var radius = require("radius");
var dgram = require("dgram");
var crypto = require('crypto');

var mongoose = require('mongoose'),
	Statistics = mongoose.model('Statistics');

// Instruct node-radius where to locate the freeradius dictionary file
radius.add_dictionary(__dirname + '../../../config/dictionary/dictionary.freeradius');

// Create and listen for RADIUS responses on our requests
var radiusClient = dgram.createSocket("udp4");
radiusClient.bind(22214);

radiusClient.on("listening", function () {
	var address = radiusClient.address();
	console.error("radius server listening " +
	  address.address + ":" + address.port);
});

exports.StatusPing = function(server) {

	var packet = radius.encode({
	  code: "Status-Server",
	  identifier: 1,
	  secret: server.radius.secret,
	  attributes: [
	    ['Vendor-Specific', 11344, [['FreeRADIUS-Statistics-Type', '0x1f']]],
	  ]
	});

	radiusClient.on('message', function(msg, remote_info) {
		var response = radius.decode({packet: msg, secret: server.radius.secret});

		var stats = new Statistics({
			'freeradiusStatistics': response.attributes['Vendor-Specific'],
			'user': server.user,
			'server': server._id
		});

		stats.save();
	});

	radiusClient.send(packet, 0, packet.length, server.radius.port, server.radius.address);
};




