/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    EventLiteShow = mongoose.model('Event_LiteShow'),
    EventJoin = mongoose.model('Event_Join'),
    UserLocation = mongoose.model('User_Location'),
    _ = require('underscore');

/**
 * Find event_join by id
 */
exports.event_join = function(req, res, next, id) {
    EventJoin.load(id, function(err, event_join) {
        console.log('in event_join constr');
    // don't know WTF this is doing.
    //EventJoin.findOne({ _id: req.params.event_joinId }).populate('_user_locationId').exec(function (err, event_joint) {
        //console.log(err);
        if (err) return next(err);
        if (!event_join) return next(new Error('Failed to load event_join ' + id));
        req.event_join = event_join;
        next();
    });
};

/**
 * 
 */
exports.create = function(req, res) {
  
  curTime = new Date().getTime();
  curTime = curTime - (new Date().getTimezoneOffset() * 60000);  // convert to GMT time offset
  
  //  we are seeing if the time that the mobile app has is different than the server.  The problem is that the time to post
  //   to the server is different depending on the phone, so the time offset is actually varied enough due to this posting that
  //   it makes the show visibly inaccurate.   Assuming all cell phones have the same time, then really what we are trying to 
  //    accomplish here is to take into account phones that are in different time zones, so if the calculated offset is less than 1 
  //    second, we set the offset to 0.  If some day we have a better way to deal with these offsets, then we can do it here.
  //
  //    
  if( req.body.mobile_time) {
    mobile_date = new Date(req.body.mobile_time);
    mobile_timezone_offset = mobile_date.getTimezoneOffset() * 60000;
    mobile_time_offset = (mobile_date.getTime() - mobile_timezone_offset) - curTime;
    if (mobile_time_offset < 1000 ) {  
      mobile_time_offset = 0;
    }
  } else {
    mobile_time_offset = 0;  // if no time is passed from the phone, then assume it's the same as server.
  }

  // I'm thinking that if they already joined, then we delete the first join and create the new one.  That will help me out
  //  in testing, too, because we'll be deleting old data that we're not using any more.
  
// HCSNOTE:  need to check to see if the user already joined this event and if they did, then return an error.
  //EventJoin.find({_user_locationId: req.user_location._id}, function(err, event_joins) {
  //  if (err || event_joins.count > 0) {
  //    res.render('error', {
  //      status: 500
  //    });
  //  }
 // });
    
      // see if there's an active event_liteshow object before going any further
    EventLiteShow.find_active(req.user_location._lw_eventId, 
      function(err, event_liteshow) {
        if (err)
        {
            res.render('No active event_liteshow error', {
            status: 500
          });
        }
        else
        {
            console.log('Something WAS FOUND. req.user_location._lw_eventId is ' + req.user_location._lw_eventId);
            if (!event_liteshow) {
                console.log('error, event liteshow is null');
                console.log(err);
                res.status(404);
                res.send({error: 'event_liteshow not available'});
                return;
            }
            else
            {
              console.log('trying to create the EJ');
             
              // look for a winner and create the object.
              UserLocation.find({ _lw_eventId: req.user_location._lw_eventId }, function (err, UL) {
                  var event_join = new EventJoin(req.body);
                  event_join.mobile_time_offset_ms = mobile_time_offset;
                  event_join._user_locationId = req.user_location._id;
                  event_join._event_liteshowId = event_liteshow._id;

                  if (err)
                  {
                    console.log('Err in find UL to set Winner. err=' + err);
                    return;
                  }

                  // console.log('UL[0]._id=' + UL[0]._id.toString() + '. req.user_location._id=' + req.user_location._id.toString());
                  if (UL[0]._id.toString() === req.user_location._id.toString())
                  {
                      // console.log('setting winner to UL[0]._id=' + UL[0]._id);
                      event_join._winner_user_locationId = req.user_location._id;
                  }
    
                  // use the offset to set the time for this phone to start
                  event_join.mobile_start_at = new Date(event_liteshow.start_at.getTime() - event_join.mobile_time_offset_ms);

                  event_join.save(function (err) {
                      if (err) {
                          res.render('error', {
                              status: 500
                          });
                      } else {
                          res.jsonp(event_join);
                      }
                  });
              });

         
  //            if( Math.floor((Math.random()*10)+1) >= 5 )       // for now, 1/2 the joins will be winners
                //event_join._winner_user_locationId = req.user_location._id;
  //            else
                // for now, the 2nd one to join will be the winner
              
              //event_join._winner_user_locationId = req.user_location._id;
              //event_liteshow._winner_user_locationId = req.user_location._id;
              //EventLiteShow

            } // end else
          } // end else
      });  // end call back function for find_active
};

/**
 * Update a event_join
 */
exports.update = function(req, res) {
    var event_join = req.event_join;
    event_join = _.extend(event_join, req.body);
    event_join.save(function(err) {
        res.jsonp(event_join);
    });
};


/**
 * Delete an event_join
 */
exports.destroy = function(req, res) {
    var event_join = req.event_join;

    event_join.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(event_join);
        }
    });
};

/**
 * Show a event_join
 */
exports.show = function(req, res) {
    res.jsonp(req.event_join);
};

/**
 * List of EventJoins for an event_liteshow - should be thousands
 */
exports.all = function(req, res) {
    EventJoin.find({_lw_eventId: req.params.lw_eventId})
    .sort('logical_col')
    .populate('_user_locationId')
    .exec(function(err, event_joins) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(event_joins);
        }
    });
};
