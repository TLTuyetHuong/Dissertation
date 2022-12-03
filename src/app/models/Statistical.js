const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Statistical = new Schema({
	accessTimes: { type: Number},
}, {
    timestamps: true,
});

// Add slugins
Statistical.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('Statistical', Statistical, 'statisticals');
