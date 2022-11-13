
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const GoiY = new Schema({
    name: { type: String, require: true},
    address: { type: String, require: true},
    email: { type: String, require: true},
    image: { type: String},
    slug: { type: String, slug: 'name', unique: true }
},{
    timestamps: true,
});

// Add slugins
mongoose.plugin(slug);
GoiY.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('GoiY', GoiY, 'suggestions');
