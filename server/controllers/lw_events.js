/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    LWEvent = mongoose.model('LW_Event'),
    _ = require('underscore');


/**
 * Find lw_event by id
 */
exports.lw_event = function(req, res, next, id) {
    LWEvent.load(id, function(err, lw_event) {
        if (err) return next(err);
        if (!lw_event) return next(new Error('Failed to load lw_event ' + id));
        req.lw_event = lw_event;
        next();
    });
};


 /*
 * Create an lw_event
 */
exports.create = function(req, res) {
    var clientId = req.params.clientId;
    var lw_event = new LWEvent(req.body);
    lw_event.clientId = clientId;
    
    lw_event.save(function(err) {
        if (err) {
            return res.send('clients/', {
                errors: err.errors,
                client: client
            });
        } else {
            res.jsonp(lw_event);
        }
    });
};


/**
 * Show an event
 */
exports.show = function(req, res) {
    res.jsonp(req.lw_event);
};

/**
 * List of Events for a client
 */
exports.all = function(req, res) {
    LWEvent.find({_clientId: req.client._id}).sort('name').exec(function(err, lwevents) {
        if (err) {
            res.render('Could not find events', {
                status: 500
            });
        } else {
            res.jsonp(lwevents);
        }
    });
};