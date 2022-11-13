const KhachSan = require('../models/KhachSan');
const Admin = require('../models/Admin');
const DatTour = require('../models/DatTour');
const Comment = require('../models/Comment');
const { multipleMongooseToObject } = require('../../until/mongoose');
const { mongooseToObject } = require('../../until/mongoose');

class KhachSanController {
    // [GET] /khach-san
    index(req, res, next) {
        KhachSan.find({})
            .then(khachsans => {
                res.render('khachsan/index', {
                    title: 'Ở đâu tại Cần Thơ',
                    khachsans: multipleMongooseToObject(khachsans)
                });
            })
            .catch(next);
    }

    // [GET] /khach-san/:slug
    async show(req, res, next) {
        let khachsan = await KhachSan.findOne({slug: req.params.slug}).catch(next);
        let title = khachsan.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        KhachSan.findOne({slug: req.params.slug})
            .then((khachsans) => {
                if(req.params.slug==khachsans.slug){
                    res.render('baiviets/homestay/'+req.params.slug, {
                        title: khachsans.title,
                        slug: khachsans.slug,
                        comments: multipleMongooseToObject(comments),
                    })
                }
            })
            .catch(next);
    }

    // [POST] /khach-san/:slug
    async comment(req, res, next) {
        let khachsans = await KhachSan.findOne({slug: req.params.slug}).catch(next);
        const title = khachsans.title;
        const today = new Date();
        const month = today.getMonth()+1;
        const date = today.getDate()+'/'+month+'/'+today.getFullYear();
        const time = today.getHours() + ":" + today.getMinutes();
        const formData = req.body;
        const comments = new Comment({
            comment: formData.comment,
            like: formData.like,
            posts: title, 
            date: date+' '+time,
        });
        comments
            .save()
            .then(() => res.redirect('back'))
            .catch((error) => {});
    }

    // [PUT] /khach-san/like/:id
    async like(req, res, next) {
        let comments = await Comment.findById(req.params.id).catch(next);
        const like1 = comments.like;
        Comment.updateOne({ _id: req.params.id }, {like: like1+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // Quan Ly Khach San

    // [GET] /admin/quan-ly-khach-san
    async ql_khachsan(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let khachsan = await KhachSan.find({}).sort({updatedAt: -1}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await KhachSan.countDocumentsDeleted({}); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_khachsan", {
                title: "Quản lý Khách Sạn",
                admins: mongooseToObject(admins),
                khachsan: multipleMongooseToObject(khachsan),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-khach-san"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-khach-san/thung-rac
    async trashKhachSan(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            KhachSan.findDeleted({})
                .then((khachsans) =>
                    res.render('admin/trash-khach-san',{
                        title: 'Danh sách khách sạn đã xoá',
                        admins: mongooseToObject(admins),
                        khachsans: multipleMongooseToObject(khachsans),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-khach-san"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/quan-ly-khach-san/handle-form-action
    handleFormActionsKS(req, res, next){
        switch(req.body.action) {
            case 'delete':
                KhachSan.delete({_id: {$in: req.body.khachsanIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/quan-ly-khach-san/trash-form-action
    trashFormActionsKS(req, res, next){
        switch(req.body.action) {
            case 'delete':
                KhachSan.deleteMany({_id: {$in: req.body.khachsanIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                KhachSan.restore({_id: {$in: req.body.khachsanIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
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
        KhachSan.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-khach-san/:id
    updateKhachSan(req, res, next) {
        KhachSan.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-khach-san"))
            .catch(next);
    }

    // [DELETE] /admin/quan-ly-khach-san/:id/force
    forceKhachSan(req, res, next) {
        KhachSan.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }


    // [PATCH] /admin/quan-ly-khach-san/:id/khoi-phuc
    restoreKhachSan(req, res, next) {
        KhachSan.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }
}

module.exports = new KhachSanController();
