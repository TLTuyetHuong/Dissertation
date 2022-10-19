const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const TinTuc = new Schema({
    image: { type: String},
    title: { type: String},
    color: { type: String},
    slug: { type: String, slug: 'title', unique: true },
},{
    timestamps: true,
});

module.exports = mongoose.model('TinTuc', TinTuc, 'tintucs');
