const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const AmThuc = new Schema({
    title: { type: String, require: true},
    image: { type: String, require: true},
    address: { type: String, require: true},
    place: { type: String},
    price: { type: String},
    map: { type: String},
    description: { type: String},
    open: { type: String},
    close: { type: String},
    tag: { type: String},
    slug: { type: String, slug: 'title', unique: true }
},{
    timestamps: true,
});

// Add slugins
mongoose.plugin(slug);
AmThuc.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('AmThuc', AmThuc, 'amthucs');
