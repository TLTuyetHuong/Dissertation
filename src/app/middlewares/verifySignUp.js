
const ROLES = require('../models/role');
const Admin = require('../models/Admin');

checkDuplicateEmail = (req, res, next) => {

    // Email
    Admin.findOne({
      email: req.body.email
    }).exec((err, admins) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (admins) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted
};

module.exports = verifySignUp;