'use strict';

// Servers routes use servers controller
var servers = require('../controllers/servers');

module.exports = function(app, passport) {

    // Servers routes
    app.get('/servers', servers.all);
    app.post('/servers', servers.create);
    app.put('/servers/:serverId', servers.update);
    app.del('/servers/:serverId', servers.delete);

    // Servers administration pages
    app.get('/admin/servers', function(req, res, next) {
    	res.render('servers/admin', {
    		navServers: true
    	});
    });

    app.param('serverId', servers.server);

};
