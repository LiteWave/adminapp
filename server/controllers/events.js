/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Event = mongoose.model('Event'),
    _ = require('underscore');


/**
 * Find event by id
 */
exports.event = function(req, res, next, id) {
    Event.load(id, function(err, event) {
        if (err) return next(err);
        if (!event) return next(new Error('Failed to load event ' + id));
        req.event = event;
        next();
    });
};


 /*
 * Create an event
 */
exports.create = function(req, res) {
  var clientId = req.params.clientId;
  console.log('Event:Create:clientId=' + clientId);
  console.log('Event:Create:req.body=' + req.body.logicalLayout.columns[0].sectionList[0]);
    var event = new Event(req.body);
    event.clientId = clientId;
    
    event.save(function(err) {
      if (err) {
            return res.send('clients/', {
                errors: err.errors,
                client: client
            });
        } else {
            res.jsonp(event);
        }
    });
};

/**
 * Delete an evemt
 */
exports.destroy = function (req, res) {
  var event = req.event;

  event.remove(function (err) {
    if (err) {
      res.render('Error deleting Event', {
        status: 500
      });
    } else {
      res.jsonp(event);
    }
  });
};


/**
 * Show an event
 */
exports.show = function(req, res) {
    res.jsonp(req.event);
};

/**
 * List of Events for a client
 */
exports.all = function(req, res) {
    Event.find({_clientId: req.client._id}).sort('name').exec(function(err, events) {
        if (err) {
            res.render('Could not find events', {
                status: 500
            });
        } else {
            res.jsonp(events);
        }
    });
};