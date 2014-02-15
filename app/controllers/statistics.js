'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Statistics = mongoose.model('Statistics'),
    _ = require('lodash');

/**
 * Find statistics by id
 */
exports.statistics = function(req, res, next, id) {
    Servers.load(id, function(err, statistics) {
        if (err) return next(err);
        if (!statistics) return next(new Error('Failed to load statistics ' + id));
        req.statistics = statistics;
        next();
    });
};

/**
 * Get the latest freeradius status information for the given server
 */
exports.freeradiusUptime = function(req, res) {

    Statistics.findOne(
        {
            server: req.server._id,
            user: req.user._id
        }
    ).sort({created: -1}).exec(function(err, stat) {
        if (err) {
            return res.jsonp(
                500,
                {"error": err.message}
            );
        } else {
            res.jsonp(
                200,
                stat
            );
        }

    });
};




exports.freeradiusWeeklyaccountingRequests = function(req, res) {

    var _data = {};

    var accountingRequestsTypes = function() {
        Statistics.aggregate(
        [
            {
                $match: {
                    server: req.server._id,
                    user: req.user._id
                }

            },
            {
                $project: { 
                    day: { $dayOfWeek: "$created" },
                    "freeradiusStatistics": 1,
                }
            },
            {
                $group: {
                    _id: "$day",
                    "maxAcctMalformedRequests": {
                        "$max": "$freeradiusStatistics.FreeRADIUS-Total-Acct-Malformed-Requests"
                    },
                    "maxAcctInvalidRequests": {
                        "$max": "$freeradiusStatistics.FreeRADIUS-Total-Acct-Invalid-Requests"
                    },
                    "maxAcctDroppedRequests": {
                        "$max": "$freeradiusStatistics.FreeRADIUS-Total-Acct-Dropped-Requests"
                    },
                    "maxAcctUnknownTypes": {
                        "$max": "$freeradiusStatistics.FreeRADIUS-Total-Acct-Unknown-Types"
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ],
        function(err, docs) {
            if (err) throw err;

            _data.accountingRequestsTypes = docs;
            return res.jsonp(_data);
        });

    };

    // Get accounting requests
    Statistics.aggregate(
        [
            {
                $match: {
                    server: req.server._id,
                    user: req.user._id
                }

            },
            {
                $project: { 
                    day: { $dayOfWeek: "$created" },
                    "freeradiusStatistics": 1,
                }
            },
            {
                $group: {
                    _id: "$day",
                    "max": {
                        "$max": "$freeradiusStatistics.FreeRADIUS-Total-Accounting-Requests"
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ],
    function(err, docs) {
        if (err) throw err;
        _data.accountingRequests = docs;
        return accountingRequestsTypes();
    });
};



exports.freeradiusWeeklyAccessRequests = function(req, res) {

    var _data = {};

    var accessRequests = function() {
        Statistics.aggregate(
        [
            {
                $match: {
                    server: req.server._id,
                    user: req.user._id
                }

            },
            {
                $project: { 
                    day: { $dayOfWeek: "$created" },
                    "freeradiusStatistics": 1,
                }
            },
            {
                $group: {
                    _id: "$day",
                    "max": {
                        "$max": "$freeradiusStatistics.FreeRADIUS-Total-Access-Requests"
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ],
        function(err, docs) {
            if (err) throw err;

            _data.accessRequests = docs;
            return res.jsonp(_data);
        });

    };

    // Get access accepts
    var accessAccepts = function() {
        Statistics.aggregate(
        [
            {
                $match: {
                    server: req.server._id,
                    user: req.user._id
                }

            },
            {
                $project: { 
                    day: { $dayOfWeek: "$created" },
                    "freeradiusStatistics": 1,
                }
            },
            {
                $group: {
                    _id: "$day",
                    "max": {
                        "$max": "$freeradiusStatistics.FreeRADIUS-Total-Access-Accepts"
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ],
        function(err, docs) {
            if (err) throw err;

            _data.accessAccepts = docs;
            return accessRequests();
        });

    };


    // Get access rejects
    Statistics.aggregate(
        [
            {
                $match: {
                    server: req.server._id,
                    user: req.user._id
                }

            },
            {
                $project: { 
                    day: { $dayOfWeek: "$created" },
                    "freeradiusStatistics": 1,
                }
            },
            {
                $group: {
                    _id: "$day",
                    "max": {
                        "$max": "$freeradiusStatistics.FreeRADIUS-Total-Access-Rejects"
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ],
    function(err, docs) {
        if (err) throw err;
        _data.accessRejects = docs;
        return accessAccepts();
    });

};