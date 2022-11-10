const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const KhachSan = new Schema({
    image: { type: String},
    title: { type: String},
    type: { type: String},
    slug: { type: String, slug: 'title', unique: true },
},{
    timestamps: true,
});

module.exports = mongoose.model('KhachSan', KhachSan, 'khachsans');
