const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.admin = require("./Admin");
db.role = require("./role");

db.ROLES = ["admin", "user", "staff"];

module.exports = db;