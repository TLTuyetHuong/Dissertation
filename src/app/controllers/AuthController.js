const Admin = require('../models/Admin');
const { multipleMongooseToObject } = require('../../until/mongoose');
const Role = require('../models/role');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const admins = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  admins.save((err, admins) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          admins.roles = roles.map(role => role._id);
          admins.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "Admin was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "admins" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        admins.roles = [role._id];
        admins.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Admin was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  Admin.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, admins) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!admins) {
        return res.status(404).send({ message: "Admin Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        admins.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: admins.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < admins.roles.length; i++) {
        authorities.push("ROLE_" + admins.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: admins._id,
        name: admins.name,
        email: admins.email,
        roles: authorities,
        accessToken: token
      });
    });
};