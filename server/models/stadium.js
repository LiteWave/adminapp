/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

/**
 * Stadium Schema - 
 */
var StadiumSchema = new Schema({
  _clientId: { type: Schema.ObjectId, ref: 'Client' },  // The client associated with this Stadium.
  name: { type: String,
    required: true,
    trim: true
  },
  levels: [ // Every stadium needs at least one level even if it is just flat.
  {
    name: { type: String, required: true, trim: true, unique: true },  // e.g. 100, 200, etc. has to be unique
    sort_index: Number,  // used for the drop downs when user selects a section
    sections: [{
      name: { type: String, required: true, trim: true, unique: true },  // e.g. 301 has to be unique
      sort_index: Number,  // used for the drop downs when user selects a section
      rows: [{
        name: { type: String, required: true, trim: true },
        sort_index: Number,  // used for the drop downs when user selects a row after selecting a section
        seats: [{
          name: { type: String, required: true, trim: true },
          sort_index: Number,    // used for ordering the seat selection drop down
        }]
      }]
    }]
  }]
  
}, {collection: 'stadiums'});

 
/**
 * Statics
 */
StadiumSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
}; 

mongoose.model('Stadium', StadiumSchema);
