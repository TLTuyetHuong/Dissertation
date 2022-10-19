const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const TraiNghiem = new Schema({
    name: { type: String, require: true},
    image: { type: String, require: true},
    color: { type: String},
    slug: { type: String, slug: 'name', unique: true }
},{
    timestamps: true,
});

module.exports = mongoose.model('TraiNghiem', TraiNghiem, 'trainghiems');
