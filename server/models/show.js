/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

var LiteShowCommandSchema = new Schema({
  loc_t: String,  // location type:  col, row, seat, all, winner (specific winner's phone only) (not used by mobile app)
  lp1: Number,    // location parameter 1  (not used by mobile app)
  lp2: Number,   // only used if it's a seat and this is the column  (not used by mobile app)
  offset: Number,  // milliseconds from start of show to do this command (not returned to mobile app, only used for full command set)
  pif: String, // play if winner ('w') or loser 'l'.  if this is set and its a contest then only play the command if you're a loser or winner
  pt: String, // play type, default is 'c' for color if not specified.   could be:  wait (w), flash (f), color (c), sound (s)
  v: Boolean,  // default is false.   true if vibrate during this sequence
  lt: String, // default is 't' if not specified.  length type: t (time:  play_length1 milliseconds), r (random color between pl1 and pl2 times)
  //  NOTE: if the length type is 'r' for random, then the app will wait after it stops playing the color until pl2 time
  //
  pl1: Number,  // play length 1 parameter in milliseconds
  pl2: Number,  // play length 2 parameter (if applicable) in milliseconds
  s: String,      // name of the sound to play - for future use
  c: String,   // color:  rgb value (255,0,0 for red)
  b: Number  // brightness 1 - 10 - for future use
});

/**
 * Show Schema - 
 */

var ShowSchema = new Schema({
	_eventId: { type: Schema.ObjectId, ref: 'Event'},
	_liteshowId: { type: Schema.ObjectId, ref: 'LiteShow' },
	_winnerId: { type: Schema.ObjectId, ref: 'User_Location' },  // set if this show is a contest.
  commands: [LiteShowCommandSchema],
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

