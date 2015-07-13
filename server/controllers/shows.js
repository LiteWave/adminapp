/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Show = mongoose.model('Show'),
    _ = require('underscore');


/**
 * Find show by id
 */
exports.show = function(req, res, next, id) {
    Show.load(id, function(err, show) {
        if (err) return next(err);
        if (!show) return next(new Error('Failed to load show ' + id));
        req.show = liteshow;
        next();
    });
};

/**
 * 
 */
exports.create = function (req, res) {
    var show = new Show(req.body);
    show._eventId = req.params.eventId;
    console.log('SHOW:Create:clientId=' + show._eventId);
    console.log('SHOW:Create:req.body=' + req.body);
    show.save(function(err) {
        if (err) {
            return res.send('shows/', {
                errors: err.errors,
                show: show
            });
        } else {
            res.jsonp(show);
        }
    });
};

/**
 * Update a show
 */
exports.update = function(req, res) {
    var show = req.show;
    show = _.extend(show, req.body);
    show.save(function(err) {
        res.jsonp(show);
    });
};


/**
 * Delete an show
 */
exports.destroy = function(req, res) {
    var show = req.show;

    show.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(show);
        }
    });
};

/**
 * Show a show
 */
exports.show = function(req, res) {
    res.jsonp(req.show);
};

/**
 * List of Shows for an Event 
 */
exports.all = function(req, res) {
    Show.find({_eventId: req.event._id}).exec(function(err, shows) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(shows);
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
  var e = req.show;
  var col_delay = 300;  // 1/3 a second
  var first_length = 1000;  // 1 second
  var second_length = 750;  // 750 ms
  var third_length = 500;  // 500 ms
  var fourth_length = 250;  // 250 ms
  var black = "0,0,0";
  var red = "216,19,37";
  var white = "162,157,176";

  //var wait_time = (col - 1) * col_delay;   // when to start the white
  //var total_white = white_length - start_time;
  
  var seq = {"title": "Pilot Contest", "show_type":"contest", "commands": []};
  
  seq.commands.push({ "c": black, "pl1": first_length });
  seq.commands.push({ "c": white, "pl1": first_length });
  seq.commands.push({ "c": red, "pl1": first_length });
  seq.commands.push({ "c": black, "pl1": first_length });
  seq.commands.push({ "c": white, "pl1": first_length });
  seq.commands.push({ "c": red, "pl1": first_length, "v": true });

  seq.commands.push({ "c": black, "pl1": second_length });
  seq.commands.push({ "c": white, "pl1": second_length });
  seq.commands.push({ "pif": "w", "c": red, "pl1": second_length });
  seq.commands.push({ "c": black, "pl1": second_length });
  seq.commands.push({ "pif": "w", "c": white, "pl1": second_length });
  seq.commands.push({ "c": red, "pl1": second_length, "v": true });

  seq.commands.push({ "c": black, "pl1": third_length });
  seq.commands.push({ "c": white, "pl1": third_length });
  seq.commands.push({ "pif": "w", "c": red, "pl1": third_length });
  seq.commands.push({ "c": black, "pl1": third_length });
  seq.commands.push({ "pif": "w", "c": white, "pl1": third_length });
  seq.commands.push({ "c": red, "pl1": third_length });

  seq.commands.push({ "c": black, "pl1": fourth_length });
  seq.commands.push({ "c": white, "pl1": fourth_length });
  seq.commands.push({ "pif": "w", "c": red, "pl1": fourth_length });
  seq.commands.push({ "pif": "w", "c": black, "pl1": fourth_length });
  seq.commands.push({ "pif": "w", "c": white, "pl1": fourth_length });
  seq.commands.push({ "pif": "w", "c": red, "pl1": fourth_length, "v": true });

  seq.commands.push({ "pif": "w", "c": red, "pl1": fourth_length, "v": true, "strobe": 1 });

  seq.commands.push({ "pif": "w", "pt": "win", "c": "216,19,37", "pl1": 5000 });
  seq.commands.push({ "pif": "l", "c": black, "pl1": 500 });

  res.jsonp(seq);  
};
/*
 * calculates the array of commands for a light show for this user
 */
exports.user_liteshow2 = function(req, res) {
  var u = req.user_location;
  var section = u.user_seat.section;
  var e = req.show;
  
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
