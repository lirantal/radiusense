'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Servers Schema
 */
var Servers = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    radius: {
        address: {
            type: String,
            default: '',
            trim: true
        },
        port: {
            type: Number,
            min: 1,
            max: 65535,
            default: 1812,
            trim: true
        },
        secret: {
            type: String,
            default: '',
            trim: true
        }
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Hooking a pre save middleware
 */
Servers.pre('save', function(next) {
  this.updated = new Date();
  next();
});

/**
 * Validations
 */
Servers.path('title').validate(function(title) {
    return typeof title === 'string' && title.length > 0;
}, 'Title cannot be blank');

/**
 * Statics
 */
Servers.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

Servers.statics.loadSingle = function(userId, cb) {
    this.findOne({
        user: userId
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Servers', Servers);
