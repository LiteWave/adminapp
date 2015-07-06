/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

/**
 * Show Schema - 
 */

var ShowSchema = new Schema({
	_eventId: { type: Schema.ObjectId, ref: 'Event'},
	_liteshowId: { type: Schema.ObjectId, ref: 'LiteShow' },
	_winnerId: {type: Schema.ObjectId, ref: 'User_Location'},  // set if this show is a contest.
	start_at: Date,  // exact time to start show - normally set dynamically during the event since the start time might not be known ahead of time
	type: Number,   // type of show: liteshow, liteshow + contest, contest	
	winnerSections: [{ name: { type: String, trim: true } }]
});

/**
 * Statics
 */
ShowSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('_eventId').populate('_liteshowId').exec(cb);
    },
    // looks for an eventLiteShow that has a start_at that is after now
    find_active: function(event_id, cb) {
      var utc = new Date().toISOString();
      var curDateUTC = new Date(utc);
      
      this
      .findOne({ _eventId: event_id})
      .where('start_at').gt(utc)
      .exec(cb);
    }
};

/**
 * Methods
 */
ShowSchema.methods = {

    getUserCommands: function(user_location_id) {
      // return a LiteShow object that contains just the commands for this user's seat
      
    },
    setWinner: function(winner_id) {
        this._winnerId = winner_id;
        return 'ok';
    }
};
mongoose.model('Show', ShowSchema);

