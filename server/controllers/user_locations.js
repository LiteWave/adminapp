/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Event = mongoose.model('Event'),
    LogicalLayout = mongoose.model('LogicalLayout'),
    UserLocation = mongoose.model('User_Location'),
    _ = require('underscore');


/**
 * Find user_location by id
 */
exports.user_location = function (req, res, next, id)
{
  UserLocation.load(id, function (err, user_location)
  {
    if (err) return next(err);
    if (!user_location) return next(new Error('Failed to load user_location ' + id));
    req.user_location = user_location;
    next();
  });
};

/**
 * 
 */
exports.create = function (req, res)
{
  console.log('UL:Create:event id=' + req.params.eventId + '. user_key:' + req.body.user_key);

  UserLocation.findOne({ _eventId: req.params.eventId, user_key: req.body.user_key }).exec(function (err, user_location)
  {
    // console.log(user_location);
    if (err)
    {
      console.log('UL:Create:Some kind of error on finding UL: ' + err);
      return res.status(400).jsonp(err);
    }

    if (user_location != null)
    {
      // Log a message that we are reusing the UL.
      console.log('UL:Create:Info: Reusing userLocation with user_key=' + req.body.user_key);

      user_location.delete;
      user_location = null;
    }
    else
    {
      // Check if the seat is already taken?
      /*user_seat: {
          level: String,
          section: String,
          row: String,
          seat_number: String
      },*/

      console.log('UL:Create:nothing found, creating new UL with ' + req.body.user_key);
    }

    LogicalLayout.findOne({ _eventId: req.params.eventId }).exec(function (err, layout)
    {
      if (err)
      {
        console.log('UL:Create:Some kind of error on finding Layout: ' + err);
        return res.status(400).jsonp(err);
      }

      var user_location = new UserLocation(req.body);
      user_location._eventId = req.params.eventId;

      if (!user_location.updateLogicalSeat(layout))
      {
        console.log('UL:Create:Error setting logical seat. Defaulting to 1 and 1.');
        this.logical_col = 1;
        this.logical_row = 1;
      }

      user_location.save(function (err, UL)
      {
        if (err)
        {
          console.log('UL:Create:Error saving UL. err: ' + err);
          return res.status(400).jsonp(err);
        }
        else
        {
          res.jsonp(UL);
        }
      });
    });
  });
};

/**
 * Update a user_location
 */
exports.update = function (req, res)
{
  var user_location = req.user_location;
  user_location = _.extend(user_location, req.body);
  user_location.updateLogicalSeat();
  user_location.save(function (err)
  {
    res.jsonp(user_location);
  });
};


/**
 * Delete an user_location
 */
exports.destroy = function (req, res)
{
  var user_location = req.user_location;

  user_location.remove(function (err)
  {
    if (err)
    {
      res.render('Error deleting User Location', {
        status: 500
      });
    }
    else
    {
      res.jsonp(user_location);
    }
  });
};

/**
 * Show a user_location
 */
exports.show = function (req, res)
{
  res.jsonp(req.user_location);
};

/**
 * List of UserLocations for an Event 
 */
exports.all = function (req, res)
{
  //UserLocation.find({ _eventId: req.params.eventId }).sort('logical_col').exec(function (err, user_locations) {
  UserLocation.find({ _eventId: req.params.eventId }).exec(function (err, user_locations)
  {
    console.log('Inside of Find');
    if (err)
    {
      res.render('Error getting User Locations', {
        status: 500
      });
    } else
    {
      console.log('no error results should be retured');
      res.json(user_locations);
    }
  });
};