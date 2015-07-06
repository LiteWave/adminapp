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
    name: {
        type: String,
        default: '',
        trim: true
    },
	date: Date,
	_stadiumId: { type: Schema.ObjectId, ref: 'Stadium'},
	_clientId: { type: Schema.ObjectId, ref: 'Client'}
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