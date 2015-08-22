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
  //console.log('UL:Create:event req.body.user_seat.level=' + req.body.user_seat.level + '. req.body.user_seat.section:' + req.body.user_seat.section);

  UserLocation.findOne({
    _eventId: req.params.eventId,
    user_seat: {
      "level" : req.body.user_seat.level,
      "section": req.body.user_seat.section,
      "row": req.body.user_seat.row,
      "seat_number": req.body.user_seat.seat_number
    }
  }).exec(function (err, user_location)
  {
    // console.log(user_location);
    if (err)
    {
      console.log('UL:Create:Some kind of error on finding UL: ' + err);
      return res.status(400).jsonp(err);
    }

    // Check if this user is rejoining or someone is trying to take someone else's seat.
    if (user_location != null && user_location.user_key != req.body.user_key)
    {
      // This seat is already taken. Return 400.
      console.log('UL:Create:This seat is already taken.');
      return res.status(400).jsonp(err);      
    }
    else if (user_location != null && user_location.user_key === req.body.user_key)
    {
      // Found an existing user who is rejoining. Log a message that we are reusing the UL.
      console.log('UL:Create:Info: Reusing userLocation with user_key=' + req.body.user_key);

      user_location.delete;
      user_location = null;
    }
    else
    {
      // Brand new user joining.
      console.log('UL:Create:No UL. Creating new UL with ' + req.body.user_key);
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