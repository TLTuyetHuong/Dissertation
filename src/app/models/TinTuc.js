const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const TinTuc = new Schema({
    image: { type: String},
    title: { type: String},
    color: { type: String},
    description: { type: String},
    slug: { type: String, slug: 'title', unique: true },
},{
    timestamps: true,
});

// Add slugins
mongoose.plugin(slug);
TinTuc.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('TinTuc', TinTuc, 'tintucs');
