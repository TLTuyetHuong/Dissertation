const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const KhachSan = new Schema({
    image: { type: String},
    title: { type: String},
    description: { type: String},
    type: { type: String},
    slug: { type: String, slug: 'title', unique: true },
},{
    timestamps: true,
});

// Add slugins
mongoose.plugin(slug);
KhachSan.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('KhachSan', KhachSan, 'khachsans');
