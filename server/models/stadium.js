/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

var SeatSchema = new Schema({
  _id: false,
  name: { type: String, trim: true, unique: true },  // e.g. 100, 200, etc. has to be unique
  sort_index: Number  // used for the drop downs when user selects a section
});

var RowSchema = new Schema({
  _id: false,
  name: { type: String, trim: true, unique: true },  // e.g. 100, 200, etc. has to be unique
  sort_index: Number,  // used for the drop downs when user selects a section
  seats: [SeatSchema]
});

var SectionSchema = new Schema({
  _id: false,
  name: { type: String, trim: true, unique: true },  // e.g. 100, 200, etc. has to be unique
  sort_index: Number,  // used for the drop downs when user selects a section
  rows: [RowSchema]
});

var LevelSchema = new Schema({
  _id: false,
  name: { type: String, trim: true, unique: true },  // e.g. 100, 200, etc. has to be unique
  sort_index: Number,  // used for the drop downs when user selects a section
  sections: [SectionSchema]
});

/**
 * Stadium Schema - 
 */
var StadiumSchema = new Schema({
  _clientId: { type: Schema.ObjectId, ref: 'Client' },  // The client associated with this Stadium.
  name: {
    type: String,
    required: true,
    trim: true
  },
  levels: [LevelSchema] // Every stadium needs at least one level even if it is just flat.  
});


/**
 * Statics
 */
StadiumSchema.statics = {
  load: function (id, cb)
  {
    this.findOne({
      _id: id
    }).exec(cb);
  }
};

mongoose.model('Stadium', StadiumSchema);
