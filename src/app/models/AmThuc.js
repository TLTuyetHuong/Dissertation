const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

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

module.exports = mongoose.model('AmThuc', AmThuc, 'amthucs');
