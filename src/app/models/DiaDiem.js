
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const DiaDiem = new Schema({
    name: { type: String, require: true},
    address: { type: String, require: true},
    place: { type: String},
    image: { type: String, require: true},
    morning: { type: String},
    afternoon: { type: String},
    price: { type: String},
    description: { type: String},
    map: { type: String},
    slug: { type: String, slug: 'name', unique: true }
},{
    timestamps: true,
});

// Add slugins
mongoose.plugin(slug);
DiaDiem.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('DiaDiem', DiaDiem, 'diadiems');
