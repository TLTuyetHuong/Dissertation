const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const Detail = new Schema({
    open: { type: String},
    close: { type: String},
    price: { type: String},
    time: { type: String},
    email: { type: String, require: true},
    description: { type: String},
    map: { type: String},
    phone: { type: String}
})

const DiaDiem = new Schema({
    name: { type: String, require: true},
    address: { type: String, require: true},
    place: { type: String},
    image: { type: String, require: true},
    slug: { type: String, slug: 'name', unique: true },
    detail: [Detail]
},{
    timestamps: true,
});

module.exports = mongoose.model('DiaDiem', DiaDiem, 'diadiems');
