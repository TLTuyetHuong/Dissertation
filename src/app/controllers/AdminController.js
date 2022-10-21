const Admin = require("../models/Admin");
const DiaDiem = require("../models/DiaDiem");
const AmThuc = require("../models/AmThuc");
const Resize = require('./Resize')
const path = require('path');
const fs = require('fs')
const { multipleMongooseToObject } = require("../../until/mongoose");
const { mongooseToObject } = require("../../until/mongoose");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { parse } = require("dotenv");


class AdminController {
      // [GET] /admin
      // index(req, res, next) {
      //     res.render('admins/login', {title: 'Đăng nhập'})
      // }
      index(req, res, next) {
        res.render("admin");
      }

      // [GET] /admin/signup
      get_signup(req, res, next) {
        res.render("admin/signup", { title: "Đăng ký" });
      }

      // [POST] /admin/signup
      async signup(req, res) {
          const admin = await Admin.findOne({
            email: req.body.email,
          });
          if (!admin) {
            const salt = bcrypt.genSaltSync(10);
            const password = req.body.password;
            const admins = new Admin({
              name: req.body.name,
              email: req.body.email,
              image: req.body.gender,
              password: bcrypt.hashSync(password, salt),
            });
            admins
              .save()
              .then(() => res.redirect("/admin"))
              .catch((error) => {});
          } else {
            res.send("Đã có tài khoản này rồi!!!");
          }
      }

      // [GET] /admin/quan-ly-dia-diem
      get_addDiaDiem(req, res, next) {
        res.render("diadiem/add", { title: "Thêm địa điểm" });
      }

      // [POST] /admin/quan-ly-dia-diem
      async addDiaDiem(req, res, next) {
        const formData = req.body;
        const diadiem = await DiaDiem.findOne({
          name: formData.name,
        });
        if(!diadiem){
          const diadiems = new DiaDiem(formData);
          diadiems.save()
              .then(() => res.redirect('back'))
              .catch((error) => {});
        }
        else {
          res.send("Đã có tài khoản này rồi!!!");
        }
      }

      // [GET] /admin/login
      get_login(req, res, next) {
        res.render("admin/login", { title: "Đăng nhập" });
      }
      // [POST] /admin
      async login(req, res, next) {
        const admins = await Admin.findOne({
          email: req.body.email,
        });
        if (admins) {
          // check user password with hashed password stored in the database
          const validPassword = await bcrypt.compare(
            req.body.password,
            admins.password
          );

          if (validPassword) {
            res.render("admin", {
              title: "Admin",
              admins: mongooseToObject(admins),
            });
          } else {
            res.send({ message: "Sai mật khẩu !" });
          }
        } else {
          res.status(401).json({ error: "User does not exist" });
        }
      }

      logout(req, res) {
        req.logout();
        req.session.destroy((err) => {
          if (err) res.redirect("error500");
          res.redirect("/");
        });
      }

      // [PUT] /admin/quan-ly-dia-diem/:id/sua-dia-diem
      editDiaDiem(req, res, next) {
        res.render("diadiem/edit", { title: "Sửa địa điểm" });
      }

      // [DELETE] /admin/quan-ly-dia-diem/:id
      deleteDiaDiem(req, res, next){
        DiaDiem.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
      }

      // [DELETE] /admin/danh-sach-admin/:id
      deleteAdmin(req, res, next){
        Admin.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
      }

      // [GET] /admin/quan-ly-dia-diem
      ql_diadiem(req, res, next) {
        DiaDiem.find({})
          .then((diadiem) => {
            res.render("admin/ql_diadiem", {
              title: 'Quản lý Điểm đến',
              diadiem: multipleMongooseToObject(diadiem),
            });
          })
          .catch(next);
      }

      // [GET] /admin/quan-ly-am-thuc
      ql_amthuc(req, res, next) {
        AmThuc.find({})
          .then((amthucs) => {
            res.render("admin/ql_amthuc", {
              title: 'Quản lý Ẩm thực',
              amthucs: multipleMongooseToObject(amthucs),
            });
          })
          .catch(next);
      }

      // [GET] /admin/danh-sach-admin
      ds_admin(req, res, next) {
        Admin.find({})
          .then((admins) => {
            res.render("admin/danh-sach-admin", {
              title: 'Danh sách Admin',
              admins: multipleMongooseToObject(admins),
            });
          })
          .catch(next);
      }
}
module.exports = new AdminController();
