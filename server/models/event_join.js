/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

/**
 * EventJoin Schema - 
 */

var EventJoinSchema = new Schema({
  mobile_time: Date,   // passed in during creation to use as an offset from the actual EventLiteShow's time
  _user_locationId: {type: Schema.ObjectId, ref: 'User_Location'},   // the user who just joined the event
  mobile_time_offset_ms: Number,  // the difference in ms between the passed in mobile time and the server time (used for info only)
  mobile_start_at: Date, // time that the mobile app should start the show - might be slightly different than the event_lite show's start time
  _winner_user_locationId: {type: Schema.ObjectId, ref: 'User_Location'},  // set to id of the winner. if null, then the receiver is not the winner
                                                                          //  the actual winner will also be stored in the event_liteshow object
  _event_liteshowId: { type: Schema.ObjectId, ref: 'EventLiteShow'}   // id of the actual event_liteshow that is currently active
});

/**
 * Statics
 */
EventJoinSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

mongoose.model('Event_Join', EventJoinSchema);

