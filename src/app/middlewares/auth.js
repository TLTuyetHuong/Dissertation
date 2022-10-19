const Admin = require('../models/Admin');
const { multipleMongooseToObject } = require('../../until/mongoose');
const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");

loggedin = (req, res, next) => {
	if(req.session.loggedin){
		res.locals.admins = req.session.addmins
		next();
	}
	else {
		res.redirect('/admins/login');
	}
}

isAuth = (req, res, next) => {
	if(req.session.loggedin){
		res.locals.admins = req.session.addmins
		res.redirect('/');
	}
	else {
		next();
	}
};

module.exports = {
	loggedin,
	isAuth,
	authJwt,
	verifySignUp
};
  