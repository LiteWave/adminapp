/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    UserLocation = mongoose.model('User_Location'),
    _ = require('underscore');


/**
 * Find user_location by id
 */
exports.user_location = function(req, res, next, id) {
    UserLocation.load(id, function(err, user_location) {
        if (err) return next(err);
        if (!user_location) return next(new Error('Failed to load user_location ' + id));
        req.user_location = user_location;
        next();
    });
};

/**
 * 
 */
exports.create = function(req, res) {
    console.log('event id=' + req.params.lw_eventId + '. user_key:' + req.body.user_key);
    
    UserLocation.findOne({ _lw_eventId: req.params.lw_eventId, user_key: req.body.user_key }).exec(function (err, user_location) {
        console.log(user_location);

        if (err) {
            console.log('some kind of error on find');
            return res.status(500).jsonp(err);
        }

        if (user_location != null) {
            // for now, we error. If we don't, need to update and not error. user_location.updateLogicalSeat();
            console.log('Error: Only one userLocation allowed for now.');
            return res.status(500).jsonp(err);
        }

        console.log('nothing found, creating new UL with ' + req.body.user_key);

        var user_location = new UserLocation(req.body);
        user_location._lw_eventId = req.params.lw_eventId;

        // For DEMO START: hardcode different logical columns based on input section.
        switch (user_location.user_seat.section)
        {
            case '101':
                user_location.logical_row = 1;
                user_location.logical_col = 1;
                break;
            case '102':
                user_location.logical_row = 1;
                user_location.logical_col = 2;
                break;
            case '103':
                user_location.logical_row = 1;
                user_location.logical_col = 3;
                break;
            case '104':
                user_location.logical_row = 1;
                user_location.logical_col = 4;
                break;
            case '105':
                user_location.logical_row = 1;
                user_location.logical_col = 5;
                break;
            default:
                user_location.logical_row = 1;
                user_location.logical_col = 1;
                break;
        }
        console.log('user_location.logical_row=' + user_location.logical_row + 'logical_col=' + user_location.logical_col); // + res.jsonp(user_location));
        // For DEMO END

        user_location.save(function (err, user_location) {
            if (err) {
                return res.status(500).jsonp(err);
            } else {
                res.jsonp(user_location);
            }
        });
    });
};

/**
 * Update a user_location
 */
exports.update = function(req, res) {
    var user_location = req.user_location;
    user_location = _.extend(user_location, req.body);
    user_location.updateLogicalSeat();
    user_location.save(function(err) {
        res.jsonp(user_location);
    });
};


/**
 * Delete an user_location
 */
exports.destroy = function(req, res) {
    var user_location = req.user_location;

    user_location.remove(function(err) {
        if (err) {
            res.render('Error deleting User Location', {
                status: 500
            });
        } else {
            res.jsonp(user_location);
        }
    });
};

/**
 * Show a user_location
 */
exports.show = function(req, res) {
    res.jsonp(req.user_location);
};

/**
 * List of UserLocations for an lw_event 
 */
exports.all = function(req, res) {
    //UserLocation.find({ _lw_eventId: req.params.lw_eventId }).sort('logical_col').exec(function (err, user_locations) {
    UserLocation.find({ _lw_eventId: req.params.lw_eventId }).exec(function (err, user_locations)
    {
        console.log('Inside of Find');
        if (err) {
            res.render('Error getting User Locations', {
                status: 500
            });
        } else {
            console.log('no error results should be retured');
            res.json(user_locations);
        }
    });
};