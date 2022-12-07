const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const DatTour = new Schema({
    name: { type: String, require: true},
    emailOwnerTour: { type: String, require: true},
    email: { type: String, require: true},
    phone: { type: String, require: true},
    address: { type: String},
    nametour: { type: String},
    pricetour: { type: String},
    status: { type: String, default: 'Chưa duyệt'},
    sm6: { type: Number, default: 0},
    f69: { type: Number, default: 0},
    lg9: { type: Number, default: 0},
    total: { type: Number},
    day: { type: String},
    slug: { type: String, slug: 'name', unique: true }
},{
    timestamps: true,
});

// Add slugins
mongoose.plugin(slug);
DatTour.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('DatTour', DatTour, 'dattours');
