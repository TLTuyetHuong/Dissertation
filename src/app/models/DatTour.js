const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const DatTour = new Schema({
    name: { type: String, require: true},
    email: { type: String, require: true},
    phone: { type: String, require: true},
    address: { type: String},
    sm6: { type: String},
    f69: { type: String},
    lg9: { type: String},
    date: { type: Date, default: Date.now()},
},{
    timestamps: true,
});

module.exports = mongoose.model('DatTour', DatTour, 'dattours');
