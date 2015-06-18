/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    EventLiteShow = mongoose.model('Event_LiteShow'),
    _ = require('underscore');


/**
 * Find event_liteshow by id
 */
exports.event_liteshow = function(req, res, next, id) {
    EventLiteShow.load(id, function(err, event_liteshow) {
        if (err) return next(err);
        if (!event_liteshow) return next(new Error('Failed to load event_liteshow ' + id));
        req.event_liteshow = event_liteshow;
        next();
    });
};

/**
 * 
 */
exports.create = function(req, res) {
    var event_liteshow = new EventLiteShow(req.body);
    event_liteshow._lw_eventId = req.params.lw_eventId;
    event_liteshow.save(function(err) {
        if (err) {
            return res.send('event_liteshows/', {
                errors: err.errors,
                event_liteshow: event_liteshow
            });
        } else {
            res.jsonp(event_liteshow);
        }
    });
};

/**
 * Update a event_liteshow
 */
exports.update = function(req, res) {
    var event_liteshow = req.event_liteshow;
    event_liteshow = _.extend(event_liteshow, req.body);
    event_liteshow.save(function(err) {
        res.jsonp(event_liteshow);
    });
};


/**
 * Delete an event_liteshow
 */
exports.destroy = function(req, res) {
    var event_liteshow = req.event_liteshow;

    event_liteshow.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(event_liteshow);
        }
    });
};

/**
 * Show a event_liteshow
 */
exports.show = function(req, res) {
    res.jsonp(req.event_liteshow);
};

/**
 * List of EventLiteShows for an lw_event 
 */
exports.all = function(req, res) {
    EventLiteShow.find({_lw_eventId: req.lw_event._id}).exec(function(err, event_liteshows) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(event_liteshows);
        }
    });
};

//
//  calculate a light show based on 34 virtual columns where each column displays white for
//       N seconds, then red, then contest with strobe.
//      each column waits M milliseconds after the prior column before displaying
//
exports.user_liteshow = function (req, res) {
    console.log('here in user_liteshow controller');
  var u = req.user_location;
  var col = u.logical_col;
  var e = req.event_liteshow;
  var col_delay = 300;  // 1/3 a second
  var white_length = 1000;
  var red_length = 1000;  // 12 seconds (10 seconds around, then hold for 2 seconds, then contest)

  var wait_time = (col-1) * col_delay;   // when to start the white
  //var total_white = white_length - start_time;
  
  var seq = {"title": "Pilot Contest", "show_type":"contest", "commands": []};
  
  if( wait_time == 0 ) {
    seq.commands[0] = {"c": "255,255,255", "pl1": white_length};
    seq.commands[1] = {"c": "216,19,37","pl1":red_length};
    seq.commands[2] = {"pif":"w", "c":"216,19,37","pl1":1000};
    seq.commands[2] = {"pif":"w", "c":"255,255,255","pl1":1000};
    seq.commands[2] = {"pif":"w", "c":"216,19,37","pl1":1000};
    seq.commands[2] = {"pif":"w", "c":"255,255,255","pl1":1000};
    seq.commands[2] = {"pif":"w", "c":"216,19,37","pl1":1000};
    seq.commands[2] = {"pif":"w", "c":"255,255,255","pl1":1000};
    seq.commands[3] = {"pif":"l", "pt":"r", "c":"216,19,37","pl1":1000, "strobe":1};
    seq.commands[4] = {"pif":"w", "pt":"win", "v":true,"pl1":1000};
  } else {
    seq.commands[0] = {"pt":"w","pl1": wait_time };
    seq.commands[1] = {"c": "255,255,255", "pl1": white_length - wait_time};
    seq.commands[2] = {"pt":"w","pl1": wait_time };
    seq.commands[3] = {"c": "216,19,37", "pl1": red_length - wait_time};
    seq.commands[4] = {"pif":"w", "c":"216,19,37","pl1":9000, "strobe":1};
    seq.commands[5] = {"pif":"l", "pt":"r", "c":"216,19,37","pl1":3000, "pl2":9000, "strobe":1};
    seq.commands[6] = {"pif":"w", "pt":"win", "v":true,"pl1":10000};
  }

  res.jsonp(seq);  
};
/*
 * calculates the array of commands for a light show for this user
 */
exports.user_liteshow2 = function(req, res) {
  var u = req.user_location;
  var section = u.user_seat.section;
  var e = req.event_liteshow;
  
  // fake shows to do a circle through 3 phones
  //  section 101 -  
  var seq1 = {"title":"Pilot Contest","show_type":"contest","commands":[
                      {"c":"216,19,37","pl1":3000,"strobe":1},
                      {"pt":"w","pl1":2000},
                      {"c":"0,0,255","pl1":3000},
                      {"c":"255,255,255","pl1":3000},
                      {"pif":"w", "c":"255,255,0","pl1":9000},
                      {"pif":"l", "pt":"r", "c":"255,255,0","pl1":3000, "pl2":9000},
                      {"pif":"w", "pt":"win", "v":true,"pl1":10000}
                      ]};
  var seq2 = {"title":"Pilot Contest","show_type":"contest","commands":[
                      {"pt":"w","pl1":1000},
                      {"c":"216,19,37","pl1":3000,"strobe":1},
                      {"pt":"w","pl1":2000},
                      {"c":"0,0,255","pl1":3000},
                      {"c":"255,255,255","pl1":2000},
                      {"pif":"w", "c":"255,255,0","pl1":9000},
                      {"pif":"l", "pt":"r", "c":"255,255,0","pl1":3000, "pl2":9000},
                      {"pif":"w", "pt":"win", "v":true,"pl1":10000},
                      ]};   
  var seq3 = {"title":"Pilot Contest","show_type":"contest","commands":[
                      {"pt":"w","pl1":2000},
                      {"c":"216,19,37","pl1":3000,"strobe":1},
                      {"pt":"w","pl1":2000},
                      {"c":"0,0,255","pl1":3000},
                      {"c":"255,255,255","pl1":1000},
                      {"pif":"w", "c":"255,255,0","pl1":9000},
                      {"pif":"l", "pt":"r", "c":"255,255,0","pl1":3000, "pl2":9000},
                      {"pif":"w", "pt":"win", "v":true,"pl1":10000},
                      ]};   
                      
  if( section == "101") {
    sequence = seq1;
  } else if( section == "102") {
    sequence = seq2;
  } else {
    sequence = seq3;
  }
  res.jsonp( sequence );
};
