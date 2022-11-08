const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
	posts: { type: String, require: true},
	comment: { type: String, require: true},
    like: { type: Number, default: 0},
	date: { type: String},
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', Comment, 'comments');
