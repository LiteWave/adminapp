/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

/**
 * UserLocation Schema - a location is a seat/location at an event at a stadium
 */
var UserLocationSchema = new Schema({
  _eventId: { type: Schema.ObjectId, ref: 'Event' },
  user_key: String,
  user_seat: {
      level: String,
      section: String,
    row: String,
    seat_number: String
  },
  logical_row: Number,
  logical_col: Number
});

/**
 * Statics
 */
UserLocationSchema.statics = {
  load: function (id, cb)
  {
    this.findOne({
      _id: id
    }).exec(cb);
  }
};

/**
 * Methods
 */
UserLocationSchema.methods = {
  /**
   * set a logical seat
   */
  updateLogicalSeat: function ()
  {
    // this needs to map the stadium's layout to a logical row/col
    //stadium = this.event._stadiumId;
    //stadium = "54c85973953b659f88276c13";

    // first loop through sections from stadium.sections[i].name == this.user_seat.section
    //  then loop through rows, find row:  sections.rows[x].name == this.user_seat.row
    //   then find seat:  row.seats[i].name == this.seat.seat_number
    //  now this.logical_col = seat.virtual_col
    return 'ok';
  }
};

mongoose.model('User_Location', UserLocationSchema);