'use strict';

exports.render = function(req, res) {
    res.render('index', {
    	user: function user() {
    		return req.user ? JSON.stringify(req.user) : 'null'
    	}
    })
};
