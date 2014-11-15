'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Statistics Schema
 */
var Statistics = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    freeradiusStatistics: {},
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    server: {
        type: Schema.ObjectId,
        ref: 'Servers'
    }
});

/**
 * Statics
 */
Statistics.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username')
    .populate('server', 'title')
    .exec(cb);
};

mongoose.model('Statistics', Statistics);
