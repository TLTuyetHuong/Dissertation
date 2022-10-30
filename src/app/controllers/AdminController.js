const Admin = require("../models/Admin");
const DiaDiem = require("../models/DiaDiem");
const AmThuc = require("../models/AmThuc");
const TinTuc = require("../models/TinTuc");
const Tour = require("../models/Tour");
const DatTour = require("../models/DatTour");
const Resize = require("./Resize");
const path = require("path");
const fs = require("fs");
const { multipleMongooseToObject } = require("../../until/mongoose");
const { mongooseToObject } = require("../../until/mongoose");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { parse } = require("dotenv");
const { timeStamp } = require("console");

class AdminController {
    // [GET] /admin
    // index(req, res, next) {
    //     res.render('admins/login', {title: 'Đăng nhập'})
    // }
    index(req, res, next) {
        res.render("admin");
    }

    // [DELETE] /admin/:id
    showTB(req, res, next) {
        DatTour.findById({_id: req.params.id})
            .then((dattours) => {
                res.render("admin/thong-tin-dat-tour", {
                    title: "Admin",
                    dattours: mongooseToObject(dattours),
                });
            })
            .catch(next);
    }

    // [GET] /admin/danh-sach-admin
    async ds_admin(req, res, next) {
        Admin.find({})
            .then((admins) => {
                res.render("admin/danh-sach-admin", {
                    title: "Danh sách Admin",
                    admins: multipleMongooseToObject(admins),
                });
            })
            .catch(next);
    }

    // [GET] /admin/:id/sua-thong-tin
    async editTTAdmin(req, res, next) {
        let admins = await Admin.findById(req.params.id).catch(next); 
        
        res.render("admin/edit-profile-admin", {
            title: "Quản lý Admin",
            admins: mongooseToObject(admins),
        });
    }

    // [PUT] /admin/:id
    updateAdmin(req, res, next) {
        Admin.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin"))
            .catch(next);
    }

    // [DELETE] /admin/:id
    deleteAdmin(req, res, next) {
        Admin.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
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
                phone: req.body.phone,
                birthday: req.body.birthday,
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
            const dattours = await DatTour.find({}).sort({createdAt: -1});
            const validPassword = await bcrypt.compare(
                req.body.password,
                admins.password
            );
            if (validPassword) {
                res.render("admin", {
                    title: "Admin",
                    admins: mongooseToObject(admins),
                    dattours: multipleMongooseToObject(dattours),
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

    // [GET] /admin/quan-ly-dia-diem
    async ql_diadiem(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let diadiems = await DiaDiem.find({}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        res.render("admin/ql_diadiem", {
            title: "Quản lý Điểm đến",
            admins: mongooseToObject(admins),
            diadiems: multipleMongooseToObject(diadiems),
            dattours: multipleMongooseToObject(dattours),
        });
    }

    // [POST] /admin/quan-ly-dia-diem
    async addDiaDiem(req, res, next) {
        const formData = req.body;
        const diadiem = await DiaDiem.findOne({
            name: formData.name,
        });
        if (!diadiem) {
            const diadiems = new DiaDiem(formData);
            diadiems
                .save()
                .then(() => res.redirect("back"))
                .catch((error) => {});
        } else {
            res.send("Đã có tài khoản này rồi!!!");
        }
    }

    // [GET] /admin/quan-ly-dia-diem/:id
    async editDiaDiem(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let diadiems = await DiaDiem.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        res.render("admin/edit-dia-diem", {
            title: "Quản lý Điểm đến",
            admins: mongooseToObject(admins),
            diadiems: mongooseToObject(diadiems),
            dattours: multipleMongooseToObject(dattours),
        });
    }

    // [DELETE] /admin/quan-ly-dia-diem/:id
    deleteDiaDiem(req, res, next) {
        DiaDiem.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-dia-diem/:id
    updateDiaDiem(req, res, next) {
        DiaDiem.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-dia-diem"))
            .catch(next);
    }

    // [GET] /admin/quan-ly-am-thuc
    async ql_amthuc(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        const page_size = 10;
        let page = req.query.page || 1; 
        if(page){
            if(page < 1) page = 1;
            page = parseInt(page);
            const start = (page - 1) * page_size;
            const end = page * page_size;
            AmThuc.find({}).skip(start).limit(page_size)
            .then(amthucs =>{
                AmThuc.countDocuments({}).then((total)=>{
                    // const tongSoPage = Math.ceil(total / page_size)
                    res.render("admin/ql_amthuc", {
                        title: "Quản lý Ẩm thực",
                        admins: mongooseToObject(admins),
                        amthucs: multipleMongooseToObject(amthucs),
                        dattours: multipleMongooseToObject(dattours),
                    });

                });
            });
        }
        else {
            AmThuc.find({})
            .then(amthucs => {
                res.render('admin/ql_amthuc', {
                    title: 'Quản lý Ẩm Thực',
                    admins: mongooseToObject(admins),
                    amthucs: multipleMongooseToObject(amthucs)
                });
            })
            .catch(next);
        }
    }

    // [POST] /admin/quan-ly-am-thuc
    async addAmThuc(req, res, next) {
        const formData = req.body;
        const amthuc = await AmThuc.findOne({
            title: formData.title,
        });
        if (!amthuc) {
            const amthucs = new AmThuc(formData);
            amthucs
                .save()
                .then(() => res.redirect("back"))
                .catch((error) => {});
        } else {
            res.send("Đã có tài khoản này rồi!!!");
        }
    }

    // [GET] /admin/quan-ly-am-thuc/:id
    async editAmThuc(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let amthucs = await AmThuc.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        res.render("admin/edit-am-thuc", {
            title: "Quản lý Ẩm Thực",
            admins: mongooseToObject(admins),
            amthucs: mongooseToObject(amthucs),
            dattours: multipleMongooseToObject(dattours),
        });
    }

    // [DELETE] /admin/quan-ly-am-thuc/:id
    deleteAmThuc(req, res, next) {
        AmThuc.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-am-thuc/:id
    updateAmThuc(req, res, next) {
        AmThuc.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-am-thuc"))
            .catch(next);
    }

    // [GET] /admin/quan-ly-tin-tuc
    async ql_tintuc(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let tintucs = await TinTuc.find({}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        res.render("admin/ql_tintuc", {
            title: "Quản lý Tin tức",
            admins: mongooseToObject(admins),
            tintucs: multipleMongooseToObject(tintucs),
            dattours: multipleMongooseToObject(dattours),
        });
    }

    // [POST] /admin/quan-ly-tin-tuc
    async addTinTuc(req, res, next) {
        const formData = req.body;
        const tintuc = await TinTuc.findOne({
            title: formData.title,
        });
        if (!tintuc) {
            const tintucs = new TinTuc(formData);
            tintucs
                .save()
                .then(() => res.redirect("back"))
                .catch((error) => {});
        } else {
            res.send("Đã có tài khoản này rồi!!!");
        }
    }

    // [GET] /admin/quan-ly-tin-tuc/:id
    async editTinTuc(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let tintucs = await TinTuc.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});

        res.render("admin/edit-tin-tuc", {
            title: "Quản lý Tin tức",
            admins: mongooseToObject(admins),
            tintucs: mongooseToObject(tintucs),
            dattours: multipleMongooseToObject(dattours),
        });
    }

    // [DELETE] /admin/quan-ly-tin-tuc/:id
    deleteTinTuc(req, res, next) {
        TinTuc.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-tin-tuc/:id
    updateTinTuc(req, res, next) {
        TinTuc.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-tin-tuc"))
            .catch(next);
    }

    // [GET] /admin/quan-ly-tour
    async ql_tour(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let tours = await Tour.find({}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        res.render("admin/ql_tour", {
            title: "Quản lý Tours",
            admins: mongooseToObject(admins),
            tours: multipleMongooseToObject(tours),
            dattours: multipleMongooseToObject(dattours),
        });
    }

    // [GET] /admin/quan-ly-tour/danh-sach-khach-dat-tour
    async ds_tour(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let dattours = await DatTour.find({}).catch(next); 
        
        res.render("admin/danh-sach-khach-dat-tour", {
            title: "Quản lý Tours",
            admins: mongooseToObject(admins),
            dattours: multipleMongooseToObject(dattours),
        });
    }

    // [POST] /admin/quan-ly-tour
    async addTour(req, res, next) {
        const formData = req.body;
        const tours = new Tour(formData);
        tours
            .save()
            .then(() => res.redirect("back"))
            .catch((error) => {});
    }

    // [GET] /admin/quan-ly-tour/:id
    async editTour(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let tours = await Tour.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        res.render("admin/edit-tour", {
            title: "Quản lý Tours",
            admins: mongooseToObject(admins),
            tours: mongooseToObject(tours),
            dattours: multipleMongooseToObject(dattours),
        });
    }

    // [GET] /admin/quan-ly-tour/xem-chi-tiet/:id
    async editDatTour(req, res, next) {
        let admins = await Admin.findOne({}).catch(next);
        let dattours = await DatTour.findById(req.params.id).catch(next); 
        
        res.render("admin/edit-dat-tour", {
            title: "Quản lý Tours",
            admins: mongooseToObject(admins),
            dattours: mongooseToObject(dattours),
        });
    }

    // [DELETE] /admin/quan-ly-tour/:id
    async deleteTour(req, res, next) {
        await Tour.deleteOne({ _id: req.params.id }).catch(next);
        await DatTour.deleteOne({ _id: req.params.id }).catch(next);
        res.redirect("back")
    }

    // [PUT] /admin/quan-ly-tour/:id
    updateTour(req, res, next) {
        Tour.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-tour"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-tour/xem-chi-tiet/:id
    updateDatTour(req, res, next) {
        DatTour.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-tour"))
            .catch(next);
    }
}
module.exports = new AdminController();
