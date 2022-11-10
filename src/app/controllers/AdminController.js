const Admin = require("../models/Admin");
const DiaDiem = require("../models/DiaDiem");
const AmThuc = require("../models/AmThuc");
const TinTuc = require("../models/TinTuc");
const Tour = require("../models/Tour");
const DatTour = require("../models/DatTour");
const Comment = require("../models/Comment");
const emailService = require('../services/verifyEmail');
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
//multer
const multer  = require('multer');
const { countDocuments } = require("../models/DatTour");
const KhachSan = require("../models/KhachSan");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/public/img')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpeg" || file.mimetype=="image/jpg" || file.mimetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("avatar");

class AdminController {
    // [GET] /admin
    async index(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            const today = new Date();
            let docs = await DatTour.aggregate([
                { $match: { status: 'Đã duyệt'} }
            ]);
            let sum = 0, sumM = 0, i, j, sumPeople = 0;
            for(i=0;i<docs.length;i++){
                const date = docs[i].createdAt;
                if(date.getFullYear() == today.getFullYear()){
                    sum = sum + docs[i].total;
                }
                if(date.getMonth()+1 == today.getMonth()+1){
                    sumM = sumM + docs[i].total;
                }
                sumPeople = sumPeople + (docs[i].sm6 + docs[i].f69 + docs[i].lg9);
                
            }
            let sumYear = sum.toLocaleString('vi', {style: 'currency', currency: 'VND' });
            let sumMonth = sumM.toLocaleString('vi', {style: 'currency', currency: 'VND' })
            let nameTour = await DatTour.aggregate([
                {
                    $match: { status: 'Đã duyệt'}
                },
                {
                    $group: {_id: "$nametour"}
                }
            ]);
            for(i=0;i<nameTour.length;i++){
                let count = await DatTour.find({nametour: nameTour[i]._id}).countDocuments();
                // console.log(count);
                // console.log(Math.max(count));
            }
            // let dt = await DatTour.findOne({total: max[0].total}).catch(next);
            // const maxPriceTour = dt.nametour;
            res.render("admin", {
                title: "Admin",
                Total: sumYear,
                Sum: sumMonth,
                sumPeople: sumPeople,
                totalVisit: docs.length,
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-dia-diem"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [GET] /admin/quen-mat-khau
    forgotPass(req, res, next) {
        res.render('admin/verifyEmail',{
            title: 'Xác minh Email',
        })
    }
    // [POST] /admin/quen-mat-khau
    async forgotPassword(req, res, next) {
        const admins = await Admin.findOne({
            email: req.body.email,
        });
        if(admins){
            console.log(admins._id);
            emailService.sendSimpleEmail({
                receiverEmail: req.body.email,
                id: admins._id,
            })
            res.render('admin/warning',{
                title: 'Xác minh Email',
            });
        }
        else {
            res.render('error404');
        }
    }

    // [GET] /admin/doi-mat-khau/:id
    async changePass(req, res, next) {
        let admins = await Admin.findById(req.params.id).catch(next); 
        
        res.render("admin/doi-mat-khau", {
            title: "Quản lý Admin",
            admins: mongooseToObject(admins),
        });
    }
    // [PUT] /admin/doi-mat-khau/:id
    changePassword(req, res, next) {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        Admin.updateOne({ _id: req.params.id}, {password: bcrypt.hashSync(password, salt) }, req.body)
            .then(() => res.redirect("/admin/login"))
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

    // [PUT] /admin/avatar/:id
    updateAvatar(req, res, next) {
        Admin.updateOne({ _id: req.params.id }, {image: req.body.avatar})
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
    signup(req, res) {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
              console.log("A Multer error occurred when uploading."); 
            } else if (err) {
              console.log("An unknown error occurred when uploading." + err);
            }else{
                const admin = await Admin.findOne({
                    email: req.body.email,
                });
                if (!admin) {
                    const salt = bcrypt.genSaltSync(10);
                    const password = req.body.password;
                    const admins = new Admin({
                        name: req.body.name,
                        email: req.body.email,
                        image: req.file.filename,
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
    
        });
        
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
                const sess = req.session;  //initialize session variable
                sess.daDangNhap = true;
                sess.email = admins.email;              
                if (sess.back){ 
                    console.log(sess.back);
                    res.redirect(sess.back);
                }
                else {
                    const today = new Date();
                    let docs = await DatTour.aggregate([
                        { $match: { status: 'Đã duyệt'} }
                    ]);
                    let sum = 0, sumM = 0, i, j, sumPeople = 0;
                    for(i=0;i<docs.length;i++){
                        const date = docs[i].createdAt;
                        if(date.getFullYear() == today.getFullYear()){
                            sum = sum + docs[i].total;
                        }
                        if(date.getMonth()+1 == today.getMonth()+1){
                            sumM = sumM + docs[i].total;
                        }
                        sumPeople = sumPeople + (docs[i].sm6 + docs[i].f69 + docs[i].lg9);
                        
                    }
                    let sumYear = sum.toLocaleString('vi', {style: 'currency', currency: 'VND' });
                    let sumMonth = sumM.toLocaleString('vi', {style: 'currency', currency: 'VND' });
                    let nameTour = await DatTour.aggregate([
                        {
                            $match: { status: 'Đã duyệt'}
                        },
                        {$group: {
                            _id: "$nametour"
                        }}
                    ]);
                    res.render("admin", {
                        title: "Admin",
                        Total: sumYear,
                        Sum: sumMonth,
                        sumPeople: sumPeople,
                        nameTour: nameTour,
                        totalVisit: docs.length,
                        admins: mongooseToObject(admins),
                        dattours: multipleMongooseToObject(dattours),
                    });
                }
            } else {
                res.render('admin/login',{ 
                    title: "Đăng nhập",
                    message: "Sai mật khẩu !  Xin vui lòng nhập lại !!" ,
                });
            }
        } else {
            res.render("admin/login", { 
                title: "Đăng nhập",
                mess: "Email của bạn không đúng ! Xin vui lòng nhập lại !!",
            });
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) res.redirect("error500");
            res.redirect("/admin/login");
        });
    }

    // Quan Ly Dia Diem //

    // [GET] /admin/quan-ly-dia-diem
    async ql_diadiem(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let diadiems = await DiaDiem.find({}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            res.render("admin/ql_diadiem", {
                title: "Quản lý Điểm đến",
                admins: mongooseToObject(admins),
                diadiems: multipleMongooseToObject(diadiems),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-dia-diem"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
        
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
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let diadiems = await DiaDiem.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/edit-dia-diem", {
                title: "Quản lý Điểm đến",
                admins: mongooseToObject(admins),
                diadiems: mongooseToObject(diadiems),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-dia-diem"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
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
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        const amthucs = await AmThuc.find({}).catch(next);

        if (req.session.daDangNhap) {
            res.render("admin/ql_amthuc", {
                title: "Quản lý Ẩm thực",
                admins: mongooseToObject(admins),
                amthucs: multipleMongooseToObject(amthucs),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-am-thuc"; //req.originalUrl
            res.redirect("/admin/login");
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
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let amthucs = await AmThuc.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/edit-am-thuc", {
                title: "Quản lý Ẩm Thực",
                admins: mongooseToObject(admins),
                amthucs: mongooseToObject(amthucs),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-am-thuc"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
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

    // Quan Ly Tin Tuc //

    // [GET] /admin/quan-ly-tin-tuc
    async ql_tintuc(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let tintucs = await TinTuc.find({}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_tintuc", {
                title: "Quản lý Tin tức",
                admins: mongooseToObject(admins),
                tintucs: multipleMongooseToObject(tintucs),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tin-tuc"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
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
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let tintucs = await TinTuc.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});

        if (req.session.daDangNhap) {
            res.render("admin/edit-tin-tuc", {
                title: "Quản lý Tin tức",
                admins: mongooseToObject(admins),
                tintucs: mongooseToObject(tintucs),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tin-tuc"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
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

    // Quan Ly Tour //

    // [GET] /admin/quan-ly-tour
    async ql_tour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let tours = await Tour.find({}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_tour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                tours: multipleMongooseToObject(tours),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-dat-tour
    async ql_dattour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            res.render("admin/ql_dattour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-tour/danh-sach-khach-dat-tour
    async ds_tour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let dattours = await DatTour.find({}).catch(next); 
        
        if (req.session.daDangNhap) {
            res.render("admin/danh-sach-khach-dat-tour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
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
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let tours = await Tour.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/edit-tour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                tours: mongooseToObject(tours),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-tour/xem-chi-tiet/:id
    async editDatTour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let dattours = await DatTour.findById(req.params.id).catch(next); 
        
        if (req.session.daDangNhap) {
            res.render("admin/edit-dat-tour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                dattours: mongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
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
            .then(() => res.redirect("/admin/quan-ly-dat-tour"))
            .catch(next);
    }

    // Quan Ly Comment //

    // [GET] /admin/quan-ly-comment
    async ql_comment(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let comment = await Comment.find({}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_comment", {
                title: "Quản lý Comment",
                admins: mongooseToObject(admins),
                comment: multipleMongooseToObject(comment),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-comment"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-comment/danh-sach-khach-dat-tour
    async ds_comment(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let dattours = await DatTour.find({}).catch(next); 
        
        if (req.session.daDangNhap) {
            res.render("admin/danh-sach-khach-dat-tour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-comment"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [POST] /admin/quan-ly-comment
    async addComment(req, res, next) {
        const formData = req.body;
        const tours = new Tour(formData);
        tours
            .save()
            .then(() => res.redirect("back"))
            .catch((error) => {});
    }

    // [GET] /admin/quan-ly-comment/:id
    async editComment(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let tours = await Tour.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/edit-tour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                tours: mongooseToObject(tours),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-comment"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [DELETE] /admin/quan-ly-comment/:id
    async deleteComment(req, res, next) {
        await Tour.deleteOne({ _id: req.params.id }).catch(next);
        await DatTour.deleteOne({ _id: req.params.id }).catch(next);
        res.redirect("back")
    }

    // [PUT] /admin/quan-ly-comment/:id
    updateComment(req, res, next) {
        Tour.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-comment"))
            .catch(next);
    }

    // Quan Ly Khach San

    // [GET] /admin/quan-ly-khach-san
    async ql_khachsan(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let khachsan = await KhachSan.find({}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_khachsan", {
                title: "Quản lý Khách Sạn",
                admins: mongooseToObject(admins),
                khachsan: multipleMongooseToObject(khachsan),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-khach-san"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [POST] /admin/quan-ly-khach-san
    async addKhachSan(req, res, next) {
        const formData = req.body;
        const khachsan = await KhachSan.findOne({
            title: formData.title,
        });
        if (!khachsan) {
            const khachsans = new KhachSan(formData);
            khachsans
                .save()
                .then(() => res.redirect("back"))
                .catch((error) => {});
        } else {
            res.send("Đã có tài khoản này rồi!!!");
        }
    }

    // [GET] /admin/quan-ly-khach-san/:id
    async editKhachSan (req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let khachsans = await KhachSan.findById(req.params.id).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});

        if (req.session.daDangNhap) {
            res.render("admin/edit-khach-san", {
                title: "Quản lý Tin tức",
                admins: mongooseToObject(admins),
                khachsans: mongooseToObject(khachsans),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-khach-san"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [DELETE] /admin/quan-ly-khach-san/:id
    deleteKhachSan(req, res, next) {
        KhachSan.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-khach-san/:id
    updateKhachSan(req, res, next) {
        KhachSan.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-khach-san"))
            .catch(next);
    }
}
module.exports = new AdminController();
