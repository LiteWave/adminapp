/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

/**
 * EventLiteShow Schema - 
 */

var EventLiteShowSchema = new Schema({
	_lw_eventId: { type: Schema.ObjectId, ref: 'LW_Event'},
	_liteshowId: { type: Schema.ObjectId, ref: 'LiteShow'},
	start_at: Date,  // exact time to start show - normally set dynamically during the event since the start time might not be known ahead of time
	_winnerId: {type: Schema.ObjectId, ref: 'User_Location'}  // set if this show is a contest.
});

/**
 * Statics
 */
EventLiteShowSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('_lw_eventId').populate('_liteshowId').exec(cb);
    },
    // looks for an eventLiteShow that has a start_at that is after now
    find_active: function(lw_event_id, cb) {
      var utc = new Date().toISOString();
      var curDateUTC = new Date(utc);
      
      this
      .findOne({ _lw_eventId: lw_event_id})
      .where('start_at').gt(utc)
      .exec(cb);
    }
};

/**
 * Methods
 */
EventLiteShowSchema.methods = {

    getUserCommands: function(user_location_id) {
      // return a LiteShow object that contains just the commands for this user's seat
      
    },
    setWinner: function(winner_id) {
        this._winnerId = winner_id;
        return 'ok';
    }
};
mongoose.model('Event_LiteShow', EventLiteShowSchema);

