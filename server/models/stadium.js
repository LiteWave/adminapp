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

  name: { type: String,
    required: true,
    unique: true,
    trim: true
  },
  sections: [
    {
      name: { type: String, required: true, trim: true },  // e.g. 301
      sort_index: Number,  // used for the drop downs when user selects a section
      rows: [{
        name: { type: String, required: true, trim: true },
        sort_index: Number,  // used for the drop downs when user selects a row after selecting a section
        virtual_row: Number,    // for shows that go from bottom to top, we start with row 1 which is court level
        seats: [{
          name: { type: String, required: true, trim: true },
          sort_index: Number,    // used for ordering the seat selection drop down
          virtual_col: Number   // starts at 1, which is teh bottom middle of the stadium map and goes clockwise
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
