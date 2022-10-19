const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({
	name: { type: String, require: true},
    email: { type: String, require: true},
    password: { type: String, require: true},
	image: { type: String},
}, {
    timestamps: true,
});

exports.getAdmin = async email => {
	try {
		const data = await Admin.find({email: email}).value();
		return data;
	} catch {
		return null;
	}
};

exports.createAdmin = async admins => {
	try {
		await Admin.push(admins).write();
		return true;
	} catch {
		return false;
	}
};

module.exports = mongoose.model('Admin', Admin, 'admins');
