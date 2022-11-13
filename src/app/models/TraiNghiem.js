const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const TraiNghiem = new Schema({
    name: { type: String, require: true},
    image: { type: String, require: true},
    color: { type: String},
    slug: { type: String, slug: 'name', unique: true }
},{
    timestamps: true,
});

// Add slugins
mongoose.plugin(slug);
TraiNghiem.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('TraiNghiem', TraiNghiem, 'trainghiems');
