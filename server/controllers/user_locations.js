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
    console.log('here' + UserLocation.config);
    console.log('event id=' + req.params.lw_eventId + 'user_key:' + req.body.user_key);

    //var existing = UserLocation.find({ user_key: '111phoneipAndGUID987' }, function (err, user_location) {
    var existing = UserLocation.find({ _lw_eventId: req.params.lw_eventId, user_key: req.body.user_key }, function (err, user_location) {
    
        console.log('inside of find');
        if (err) {
            console.log('some kind of error on find');
            return res.status(500).jsonp(err);
        }
        else if (user_location.count > 0) {
            console.log('UL found, call update and return.' + user_location.count);
            //return res.status(200).jsonp('Updated');
            console.log('UPDATED user_location: ' + user_location.user_seat.section); // + res.jsonp(user_location));
            //UserLocation.update(req, res);
            //res.render('User location already found', {
            //status: 500
        }

        console.log('nothing found, creating new UL with ' + req.body.user_key);
        var user_location = new UserLocation(req.body);
        user_location._lw_eventId = req.params.lw_eventId;

        user_location.save(function (err, user_location) {
            console.log('inside of save');
            if (err) {
                console.log('some kind of error on save');
                return res.status(500).jsonp(err);
            } else {
                console.log('user_location: ' + user_location.user_seat.section); // + res.jsonp(user_location));
                res.jsonp(user_location);
            }
        });
    });
    
    //user_location.updateLogicalSeat();
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
    UserLocation.find({ _lw_eventId: req.params.lw_eventId }).sort('logical_col').exec(function (err, user_locations) {
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