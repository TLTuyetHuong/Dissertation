const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Admin = new Schema({
	name: { type: String, require: true},
    email: { type: String, require: true},
    password: { type: String, require: true},
	image: { type: String},
	phone: { type: String},
	birthday: { type: String},
	roles: {
		Admin: { type: String, default: 'ADM'},
	}
}, {
    timestamps: true,
});

// Add slugins
Admin.plugin(mongooseDelete, { 
    deletedAt : true ,
    overrideMethods: 'all' ,
});

module.exports = mongoose.model('Admin', Admin, 'admins');
