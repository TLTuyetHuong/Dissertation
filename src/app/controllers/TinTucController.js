const TinTuc = require('../models/TinTuc');
const Admin = require('../models/Admin');
const DatTour = require('../models/DatTour');
const Comment = require('../models/Comment');
const { multipleMongooseToObject } = require('../../until/mongoose');
const { mongooseToObject } = require('../../until/mongoose');

class TinTucController {
    // [GET] /tin-tuc
    index(req, res, next) {
        TinTuc.find({tag: 'tin-tuc'})
            .then(tintucs => {
                res.render('tintucs', {
                    title: 'Tin Tức',
                    tintucs: multipleMongooseToObject(tintucs)
                });
            })
            .catch(next);
    }

    // [GET] /tin-tuc/:slug
    async show(req, res, next) {
        let tintuc = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        let title = tintuc.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        TinTuc.findOne({slug: req.params.slug})
            .then((tintucs) => {
                if(req.params.slug==tintucs.slug){
                    res.render('baiviets/tintuc/'+req.params.slug, {
                        title: tintucs.title,
                        slug: tintucs.slug,
                        comments: multipleMongooseToObject(comments),
                    })
                }
            })
            .catch(next);
    }

    // [POST] /tin-tuc/comment/:slug
    async comment(req, res, next) {
        let tintucs = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        const title = tintucs.title;
        const today = new Date();
        const month = today.getMonth()+1;
        const date = today.getDate()+'/'+month+'/'+today.getFullYear();
        const time = today.getHours() + ":" + today.getMinutes();
        const formData = req.body;
        const comments = new Comment({
            comment: formData.comment,
            like: formData.like,
            rate: formData.rate,
            posts: title, 
            date: date+' '+time,
        });
        comments
            .save()
            .then(() => res.redirect('back'))
            .catch((error) => {});
    }

    // [PUT] /tin-tuc/like/:id
    async like(req, res, next) {
        let comments = await Comment.findById(req.params.id).catch(next);
        const like1 = comments.like;
        Comment.updateOne({ _id: req.params.id }, {like: like1+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // Quan Ly Tin Tuc //

    // [GET] /admin/quan-ly-tin-tuc
    async ql_tintuc(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let tintucs = await TinTuc.find({tag: 'tin-tuc'}).sort({updatedAt: -1}).catch(next); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await TinTuc.countDocumentsDeleted({}); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_tintuc", {
                title: "Quản lý Tin tức",
                admins: mongooseToObject(admins),
                tintucs: multipleMongooseToObject(tintucs),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tin-tuc"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [GET] /admin/quan-ly-tin-tuc/thung-rac
    async trashTinTuc(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            TinTuc.findDeleted({})
                .then((tintucs) =>
                    res.render('admin/trash-tin-tuc',{
                        title: 'Danh sách tin tức đã xoá',
                        admins: mongooseToObject(admins),
                        tintucs: multipleMongooseToObject(tintucs),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-tin-tuc"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/quan-ly-tin-tuc/handle-form-action
    handleFormActionsTT(req, res, next){
        switch(req.body.action) {
            case 'delete':
                TinTuc.delete({_id: {$in: req.body.tintucIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/quan-ly-tin-tuc/trash-form-action
    trashFormActionsTT(req, res, next){
        switch(req.body.action) {
            case 'delete':
                TinTuc.deleteMany({_id: {$in: req.body.tintucIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                TinTuc.restore({_id: {$in: req.body.tintucIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
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
            res.json("Đã có tài khoản này rồi!!!");
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
        TinTuc.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-tin-tuc/:id
    updateTinTuc(req, res, next) {
        TinTuc.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-tin-tuc"))
            .catch(next);
    }

    // [DELETE] /admin/quan-ly-tin-tuc/:id/force
    forceTinTuc(req, res, next) {
        TinTuc.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PATCH] /admin/quan-ly-tin-tuc/:id/khoi-phuc
    restoreTinTuc(req, res, next) {
        TinTuc.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [GET] /admin/quan-ly-le-hoi
    async ql_lehoi(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await TinTuc.countDocumentsDeleted({}); 
        let lehois = await TinTuc.find({tag: 'le-hoi'}).sort({updatedAt: -1}).catch(next); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_lehoi", {
                title: "Quản lý Lễ Hội",
                admins: mongooseToObject(admins),
                lehois: multipleMongooseToObject(lehois),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-le-hoi"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [GET] /admin/quan-ly-trai-nghiem
    async ql_trainghiem(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await TinTuc.countDocumentsDeleted({}); 
        let trainghiems = await TinTuc.find({tag: 'trai-nghiem'}).sort({updatedAt: -1}).catch(next); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_trainghiem", {
                title: "Quản lý Trải Nghiệm",
                admins: mongooseToObject(admins),
                trainghiems: multipleMongooseToObject(trainghiems),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-trai-nghiem"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [GET] /admin/quan-ly-lich-trinh-goi-y
    async ql_lichtrinh(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await TinTuc.countDocumentsDeleted({}); 
        let lichtrinhs = await TinTuc.find({tag: 'lich-trinh-goi-y'}).sort({updatedAt: -1}).catch(next); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_lichtrinh", {
                title: "Quản lý Lịch Trình Gợi Ý",
                admins: mongooseToObject(admins),
                lichtrinhs: multipleMongooseToObject(lichtrinhs),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-lich-trinh-goi-y"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }
}

module.exports = new TinTucController();
