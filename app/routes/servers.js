'use strict';

// Servers routes use servers controller
var servers = require('../controllers/servers');

module.exports = function(app, passport) {

    // Servers routes
    app.get('/servers', servers.all);
    app.post('/servers', servers.create);
    app.put('/servers/:serverId', servers.update);
    app.del('/servers/:serverId', servers.delete);

    // Route to trigger pinging configured RADIUS servers for their statistics.
    // The URL should be as cryptographic as possible, as otherwise this may
    // turn this software into a DDOS victim.
    app.get('/servers/harvest/b5f66ac196d2a702c2f7a65adba54e22', servers.harvest);

    // Servers administration pages
    app.get('/admin/servers', function(req, res, next) {
      res.render('servers/admin', {
        navServers: true
      });
    });

    app.param('serverId', servers.server);

};
