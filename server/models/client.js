/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    Schema = mongoose.Schema;

/**
 * Client Schema - 
 */
var ClientSchema = new Schema({
    name: {
        type: String,
        trim: true
    }
});


/**
 * Validations
 */
ClientSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');


/**
 * Statics
 */
ClientSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

mongoose.model('Client', ClientSchema);