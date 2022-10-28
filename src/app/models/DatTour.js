const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const DatTour = new Schema({
    name: { type: String, require: true},
    email: { type: String, require: true},
    phone: { type: String, require: true},
    address: { type: String},
    sm6: { type: Number},
    f69: { type: Number},
    lg9: { type: Number},
},{
    timestamps: true,
});

module.exports = mongoose.model('DatTour', DatTour, 'dattours');
