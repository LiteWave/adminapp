/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

/**
 * Event Schema - an event is at a specific stadium
 */
var EventSchema = new Schema({
  _clientId: { type: Schema.ObjectId, ref: 'Client' },
  _logicalLayoutId: { type: Schema.ObjectId, ref: 'LogicalLayout' },     // what is the logical grouping of sections and rows for this event? Based on Stadium's actual sections, rows, and seat numbers.
  _stadiumId: { type: Schema.ObjectId, ref: 'Stadium' },
  date: Date,
  name: { type: String, default: '', trim: true },
  type: Number  // (future) The type of this event: sporting event (use whole Stadium), concert (half of Stadium), etc.
});


/**
 * Statics
 */
EventSchema.statics = {
  load: function (id, cb)
  {
    this.findOne({
      _id: id
    }).exec(cb);
  }
};

mongoose.model('Event', EventSchema);