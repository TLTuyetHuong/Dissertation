const emailService = require('../services/emailSevice');
const Admin = require('../models/Admin');
const Tour = require('../models/Tour');
const TinTuc = require('../models/TinTuc');
const DatTour = require('../models/DatTour');
const Comment = require('../models/Comment');
const Statistical = require('../models/Statistical');
const { multipleMongooseToObject } = require('../../until/mongoose');
const { mongooseToObject } = require('../../until/mongoose');

class AdminTourController {
    // [GET] /chu-tour
    async index(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let thongke = await Statistical.findOne({}).catch(next);
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
            res.render("admin-tour", {
                title: "Chủ Tour",
                Total: sumYear,
                Sum: sumMonth,
                sumPeople: sumPeople,
                totalVisit: docs.length,
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
                luottruycap: thongke.accessTimes,
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
            req.session.back="/chu-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [GET] /chu-tour/:id/sua-thong-tin
    async editTTAdmin(req, res, next) {
        let admins = await Admin.findById(req.params.id).catch(next); 
        
        res.render("admin/edit-profile-admin-tour", {
            title: "Sửa thông tin",
            admins: mongooseToObject(admins),
        });
    }

    // Quan Ly Tour //

    // [GET] /admin/quan-ly-tour
    async ql_tour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let tours = await Tour.find({ownerTour: req.session.email}).sort({updatedAt: -1}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await Tour.countDocumentsDeleted({}); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_tour_owner", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                tours: multipleMongooseToObject(tours),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/chu-tour/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-tour/thung-rac
    async trashTour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            Tour.findDeleted({})
                .then((tours) =>
                    res.render('admin/trash-tour-owner',{
                        title: 'Danh sách tour đã xoá',
                        admins: mongooseToObject(admins),
                        tours: multipleMongooseToObject(tours),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/chu-tour/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/quan-ly-tour/handle-form-action
    handleFormActionsTour(req, res, next){
        switch(req.body.action) {
            case 'delete':
                Tour.delete({_id: {$in: req.body.tourIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/quan-ly-tour/trash-form-action
    trashFormActionsTour(req, res, next){
        switch(req.body.action) {
            case 'delete':
                Tour.deleteMany({_id: {$in: req.body.tourIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Tour.restore({_id: {$in: req.body.tourIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [DELETE] /admin/quan-ly-tour/:id/force
    forceTour(req, res, next) {
        Tour.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }


    // [PATCH] /admin/quan-ly-tour/:id/khoi-phuc
    restoreTour(req, res, next) {
        Tour.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [GET] /admin/quan-ly-dat-tour
    async ql_dattour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let dattours = await DatTour.find({emailOwnerTour: req.session.email}).catch(next);
        let deletedCount = await DatTour.countDocumentsDeleted({}); 
        if (req.session.daDangNhap) {
            res.render("admin/ql_dattour_owner", {
                title: "Quản lý Đặt Tour",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/chu-tour/quan-ly-dat-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [GET] /admin/quan-ly-dat-tour/trang-thai/:slug
    async statusDatTour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let dattours = await DatTour.find({}).sort({createdAt: -1});
        if(req.params.slug == 'chua-duyet'){
            dattours = await DatTour.find({status: 'Chưa duyệt'});
        }else if (req.params.slug == 'da-duyet'){
            dattours = await DatTour.find({status: 'Đã duyệt'});
        }else if (req.params.slug == 'da-thanh-toan'){
            dattours = await DatTour.find({status: 'Đã thanh toán'});
        }else if (req.params.slug == 'da-ket-thuc'){
            dattours = await DatTour.find({status: 'Đã kết thúc'});
        }else dattours = await DatTour.find({status: 'Đã huỷ tour'});
        let deletedCount = await DatTour.countDocumentsDeleted({}); 
        if (req.session.daDangNhap) {
            res.render("admin/ql_dattour_owner", {
                title: "Quản lý Đặt Tour",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/chu-tour/quan-ly-dat-tour"; //req.originalUrl
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
            req.session.back="/chu-tour/quan-ly-dat-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-dat-tour/thung-rac
    async trashDatTour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            DatTour.findDeleted({})
                .then((dattours) =>
                    res.render('admin/trash-dat-tour-owner',{
                        title: 'Danh sách đơn đặt tour đã xoá',
                        admins: mongooseToObject(admins),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/chu-tour/quan-ly-dat-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/quan-ly-dat-tour/handle-form-action
    handleFormActionsDT(req, res, next){
        switch(req.body.action) {
            case 'delete':
                DatTour.delete({_id: {$in: req.body.dattourIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/quan-ly-dat-tour/trash-form-action
    trashFormActionsDT(req, res, next){
        switch(req.body.action) {
            case 'delete':
                DatTour.deleteMany({_id: {$in: req.body.dattourIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                DatTour.restore({_id: {$in: req.body.dattourIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [DELETE] /admin/quan-ly-dat-tour/:id/force
    forceDatTour(req, res, next) {
        DatTour.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }


    // [PATCH] /admin/quan-ly-dat-tour/:id/khoi-phuc
    restoreDatTour(req, res, next) {
        DatTour.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
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
            res.render("admin/edit-tour-owner", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                tours: mongooseToObject(tours),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/chu-tour/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-tour/xem-chi-tiet/:id
    async editDatTour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let dattours = await DatTour.findById(req.params.id).catch(next); 
        
        if (req.session.daDangNhap) {
            res.render("admin/edit-dat-tour-owner", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                dattours: mongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/chu-tour/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [DELETE] /admin/quan-ly-tour/:id
    async deleteTour(req, res, next) {
        await Tour.delete({ _id: req.params.id }).catch(next);
        await DatTour.delete({ _id: req.params.id }).catch(next);
        res.redirect("back")
    }

    // [PUT] /admin/quan-ly-tour/:id
    updateTour(req, res, next) {
        Tour.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/chu-tour/quan-ly-tour"))
            .catch(next);
    }

    // [PUT] /chu-tour/quan-ly-tour/xem-chi-tiet/:id
    updateDatTour(req, res, next) {
        DatTour.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/chu-tour/quan-ly-dat-tour"))
            .catch(next);
    }
}

module.exports = new AdminTourController();
