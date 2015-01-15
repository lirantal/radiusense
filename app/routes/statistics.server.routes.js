'use strict';

// Statistics routes uses statistcs controller
var statistics = require('../controllers/statistics.server.controller');

module.exports = function(app, passport) {

    // Statistics routes
    // Depends on :serverId request parameter already specified in routes/servers.js

    // FreeRADIUS server uptime
    app.get('/statistics/freeradius/uptime/:serverId', statistics.freeradiusUptime);

    // FreeRADIUS access and accounting requests 
    app.get('/statistics/freeradius/accessRequests/:serverId', statistics.freeradiusWeeklyAccessRequests);
    app.get('/statistics/freeradius/accountingRequests/:serverId', statistics.freeradiusWeeklyAccountingRequests);
    

};
