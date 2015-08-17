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
  _stadiumId: { type: Schema.ObjectId, ref: 'Stadium' },
  _clientId: { type: Schema.ObjectId, ref: 'Client' },
  date: Date,
	logicalLayout:     // what is the logical grouping of sections and rows for this event? Based on Stadium's actual sections, rows, and seat numbers.
  {
    id: Number, // id for this layout?
    columns: [{   // the length of this equals the number of logical columns
      _id: false,
      id: Number, // logical column id
      sectionList: [{ type: String, trim: true }],  // array of sections that make up this logical column.
    }],
    rows: [{      // the length of this equals the number of logical rows
      _id: false,
      id: Number, // logical row id
      sectionList: { type: String, trim: true },  // array of sections that make up this logical row.
    }]
  },
	name: { type: String, default: '', trim: true },
  type: Number  // (future) The type of this event: sporting event (use whole Stadium), concert (half of Stadium), etc.
});


/**
 * Statics
 */
EventSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

mongoose.model('Event', EventSchema);