const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Tour = new Schema({
    name: { type: String, require: true},
    ownerTour: { type: String, require: true},
    image: { type: String, require: true},
    price: { type: String, require: true},
    time: { type: String},
    startingGate: { type: String},
    slug: { type: String, slug: 'name', unique: true }
},{
    timestamps: true,
});

// Add slugins
mongoose.plugin(slug);
Tour.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('Tour', Tour, 'tours');
