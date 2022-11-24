const Admin = require("../models/Admin");
const DiaDiem = require("../models/DiaDiem");
const AmThuc = require("../models/AmThuc");
const TinTuc = require("../models/TinTuc");
const Tour = require("../models/Tour");
const DatTour = require("../models/DatTour");
const Comment = require("../models/Comment");
const GoiY = require("../models/GoiY");
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
                { $match: { $or: [ { status: 'Đã thanh toán'}, { status: 'Đã kết thúc'} ] } }
            ]);
            let sum = 0, sumM = 0, i, j, sumPeople = 0, t1=0, t2=0, t3=0, t4=0, t5=0, t6=0, t7=0, t8=0, t9=0, t10=0, t11=0, t12=0;
            for(i=0;i<docs.length;i++){
                const date = docs[i].createdAt;
                // Tổng tiền theo năm
                if(date.getFullYear() == today.getFullYear()){
                    sum = sum + docs[i].total;
                }
                // Tổng tiền theo tháng
                if(date.getMonth()+1 == today.getMonth()+1){
                    sumM = sumM + docs[i].total;
                }
                sumPeople = sumPeople + (docs[i].sm6 + docs[i].f69 + docs[i].lg9);
                
                // Tổng tiền theo từng tháng
                if(date.getMonth()+1 == 1){
                    t1 = t1 + docs[i].total;
                }
                if(date.getMonth()+1 == 2){
                    t2 = t2 + docs[i].total;
                }
                if(date.getMonth()+1 == 3){
                    t3 = t3 + docs[i].total;
                }
                if(date.getMonth()+1 == 4){
                    t4 = t4 + docs[i].total;
                }
                if(date.getMonth()+1 == 5){
                    t5 = t5 + docs[i].total;
                }
                if(date.getMonth()+1 == 6){
                    t6 = t6 + docs[i].total;
                }
                if(date.getMonth()+1 == 7){
                    t7 = t7 + docs[i].total;
                }
                if(date.getMonth()+1 == 8){
                    t8 = t8 + docs[i].total;
                }
                if(date.getMonth()+1 == 9){
                    t9 = t9 + docs[i].total;
                }
                if(date.getMonth()+1 == 10){
                    t10 = t10 + docs[i].total;
                }
                if(date.getMonth()+1 == 11){
                    t11 = t11 + docs[i].total;
                }
                if(date.getMonth()+1 == 12){
                    t12 = t12 + docs[i].total;
                }
            }
            let sumYear = sum.toLocaleString('vi', {style: 'currency', currency: 'VND' });
            let sumMonth = sumM.toLocaleString('vi', {style: 'currency', currency: 'VND' });
            let cmt = await Comment.find({}).countDocuments();
            res.render("admin", {
                title: "Admin",
                Total: sumYear,
                Sum: sumMonth,
                sumPeople: sumPeople,
                totalVisit: docs.length,
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
                cmt: cmt,
                thang1: t1,
                thang2: t2,
                thang3: t3,
                thang4: t4,
                thang5: t5,
                thang6: t6,
                thang7: t7,
                thang8: t8,
                thang9: t9,
                thang10: t10,
                thang11: t11,
                thang12: t12,
            });
        }
        else { 
            req.session.back="/admin"; //req.originalUrl
            res.redirect("/admin/login");
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
                        { $match: { $or: [ { status: 'Đã thanh toán'}, { status: 'Đã kết thúc'} ] } }
                    ]);
                    let sum = 0, sumM = 0, i, j, sumPeople = 0, t1=0, t2=0, t3=0, t4=0, t5=0, t6=0, t7=0, t8=0, t9=0, t10=0, t11=0, t12=0;
                    for(i=0;i<docs.length;i++){
                        const date = docs[i].createdAt;
                        // Tổng tiền theo năm
                        if(date.getFullYear() == today.getFullYear()){
                            sum = sum + docs[i].total;
                        }
                        // Tổng tiền theo tháng
                        if(date.getMonth()+1 == today.getMonth()+1){
                            sumM = sumM + docs[i].total;
                        }
                        sumPeople = sumPeople + (docs[i].sm6 + docs[i].f69 + docs[i].lg9);
                        
                        // Tổng tiền theo từng tháng
                        if(date.getMonth()+1 == 1){
                            t1 = t1 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 2){
                            t2 = t2 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 3){
                            t3 = t3 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 4){
                            t4 = t4 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 5){
                            t5 = t5 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 6){
                            t6 = t6 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 7){
                            t7 = t7 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 8){
                            t8 = t8 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 9){
                            t9 = t9 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 10){
                            t10 = t10 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 11){
                            t11 = t11 + docs[i].total;
                        }
                        if(date.getMonth()+1 == 12){
                            t12 = t12 + docs[i].total;
                        }
                    }
                    let sumYear = sum.toLocaleString('vi', {style: 'currency', currency: 'VND' });
                    let sumMonth = sumM.toLocaleString('vi', {style: 'currency', currency: 'VND' });
                    let cmt = await Comment.find({}).countDocuments();
                    res.render("admin", {
                        title: "Admin",
                        Total: sumYear,
                        Sum: sumMonth,
                        sumPeople: sumPeople,
                        totalVisit: docs.length,
                        admins: mongooseToObject(admins),
                        dattours: multipleMongooseToObject(dattours),
                        cmt: cmt,
                        thang1: t1,
                        thang2: t2,
                        thang3: t3,
                        thang4: t4,
                        thang5: t5,
                        thang6: t6,
                        thang7: t7,
                        thang8: t8,
                        thang9: t9,
                        thang10: t10,
                        thang11: t11,
                        thang12: t12,
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
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            Admin.find({})
            .then((admins) => {
                res.render("admin/danh-sach-admin", {
                    title: "Danh sách Admin",
                    admins: multipleMongooseToObject(admins),
                    dattours: multipleMongooseToObject(dattours),
                });
            })
            .catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-dia-diem"; //req.originalUrl
            res.redirect("/admin/login");
        }
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
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
              console.log("A Multer error occurred when uploading."); 
            } else if (err) {
              console.log("An unknown error occurred when uploading." + err);
            }else{
                let avatar = '';
                if(req.file){
                    avatar = '/img/'+req.file.filename;
                }else avatar = 'https://postgraduate.ias.unu.edu/upp/wp-content/uploads/2022/04/IAFOR-Blank-Avatar-Image-1.jpg';
                Admin.updateOne({ _id: req.params.id }, {image: avatar})
                    .then(() => res.redirect("/admin"))
                    .catch(next);
            }
        });
    }

    // [DELETE] /admin/:id
    deleteAdmin(req, res, next) {
        Admin.delete({ _id: req.params.id })
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
                    let avatar = '';
                    if(req.file){
                        avatar = req.file.filename;
                    }else avatar = 'https://postgraduate.ias.unu.edu/upp/wp-content/uploads/2022/04/IAFOR-Blank-Avatar-Image-1.jpg';
                    const admins = new Admin({
                        name: req.body.name,
                        email: req.body.email,
                        image: avatar,
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

    // [GET] /admin/danh-sach-admin/thung-rac
    async trashAdmin(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            Admin.findDeleted({})
                .then((admin) =>
                    res.render('admin/trash-admin',{
                        title: 'Danh sách user đã xoá',
                        admins: mongooseToObject(admins),
                        admin: multipleMongooseToObject(admin),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/danh-sach-admin"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/danh-sach-admin/handle-form-action
    handleFormActions(req, res, next){
        switch(req.body.action) {
            case 'delete':
                Admin.delete({_id: {$in: req.body.adminIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/danh-sach-admin/trash-form-action
    trashFormActions(req, res, next){
        switch(req.body.action) {
            case 'delete':
                Admin.deleteMany({_id: {$in: req.body.adminIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Admin.restore({_id: {$in: req.body.adminIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [DELETE] /admin/danh-sach-admin/:id/force
    forceAdmin(req, res, next) {
        Admin.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }


    // [PATCH] /admin/danh-sach-admin/:id/khoi-phuc
    restoreAdmin(req, res, next) {
        Admin.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // Quan Ly Comment //

    // [GET] /admin/quan-ly-comment
    async ql_comment(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let comment = await Comment.find({}).sort({updatedAt: -1}); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await Comment.countDocumentsDeleted({}); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_comment", {
                title: "Quản lý Comment",
                admins: mongooseToObject(admins),
                comment: multipleMongooseToObject(comment),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-comment"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-comment/thung-rac
    async trashComment(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            Comment.findDeleted({})
                .then((comments) =>
                    res.render('admin/trash-comment',{
                        title: 'Danh sách comment đã xoá',
                        admins: mongooseToObject(admins),
                        comments: multipleMongooseToObject(comments),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-comment"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/quan-ly-comment/handle-form-action
    handleFormActionsCmt(req, res, next){
        switch(req.body.action) {
            case 'delete':
                Comment.delete({_id: {$in: req.body.commentIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/quan-ly-comment/trash-form-action
    trashFormActionsCmt(req, res, next){
        switch(req.body.action) {
            case 'delete':
                Comment.deleteMany({_id: {$in: req.body.commentIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Comment.restore({_id: {$in: req.body.commentIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [DELETE] /admin/quan-ly-comment/:id
    async deleteComment(req, res, next) {
        await Comment.delete({ _id: req.params.id }).catch(next);
        res.redirect("back")
    }

    // [DELETE] /admin/quan-ly-comment/:id/force
    forceComment(req, res, next) {
        Comment.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }


    // [PATCH] /admin/quan-ly-comment/:id/khoi-phuc
    restoreComment(req, res, next) {
        Comment.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // Quan Ly Goi Y //

    // [GET] /admin/quan-ly-goi-y
    async ql_goiy(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const goiys = await GoiY.find({}).sort({createdAt: -1});
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await GoiY.countDocumentsDeleted({}); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_goiy", {
                title: "Quản lý Gợi Ý",
                admins: mongooseToObject(admins),
                goiys: multipleMongooseToObject(goiys),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-goi-y"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-goi-y/thung-rac
    async trashGoiY(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            GoiY.findDeleted({})
                .then((goiys) =>
                    res.render('admin/trash-goi-y',{
                        title: 'Danh sách gợi ý đã xoá',
                        admins: mongooseToObject(admins),
                        goiys: multipleMongooseToObject(goiys),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-goi-y"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/quan-ly-goi-y/handle-form-action
    handleFormActionsGoiY(req, res, next){
        switch(req.body.action) {
            case 'delete':
                GoiY.delete({_id: {$in: req.body.goiyIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/quan-ly-goi-y/trash-form-action
    trashFormActionsGoiY(req, res, next){
        switch(req.body.action) {
            case 'delete':
                GoiY.deleteMany({_id: {$in: req.body.goiyIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                GoiY.restore({_id: {$in: req.body.goiyIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [DELETE] /admin/quan-ly-goi-y/:id
    async deleteGoiY(req, res, next) {
        await GoiY.delete({ _id: req.params.id }).catch(next);
        res.redirect("back")
    }

    // [DELETE] /admin/quan-ly-goi-y/:id/force
    forceGoiY(req, res, next) {
        GoiY.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }


    // [PATCH] /admin/quan-ly-goi-y/:id/khoi-phuc
    restoreGoiY(req, res, next) {
        GoiY.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-goi-y/:id
    updateGoiY(req, res, next) {
        GoiY.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-goi-y"))
            .catch(next);
    }

    // Quan Ly Thung Rac //

    // [GET] /admin/quan-ly-thung-rac
    async ql_thungrac(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_thungrac", {
                title: "Quản lý Thùng Rác",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-thung-rac"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }
}
module.exports = new AdminController();
