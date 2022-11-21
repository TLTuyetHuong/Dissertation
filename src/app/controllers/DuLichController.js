const DiaDiem = require('../models/DiaDiem');
const AmThuc = require('../models/AmThuc');
const Admin = require('../models/Admin');
const DatTour = require('../models/DatTour');
const Comment = require('../models/Comment');
const GoiY = require('../models/GoiY');
const emailThanks = require('../services/emailThanks');
const { multipleMongooseToObject } = require('../../until/mongoose');
const { mongooseToObject } = require('../../until/mongoose');
const multer  = require('multer');
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
}).single("image");

class DuLichController {
    // [GET] /du-lich/dia-diem
    diadiem(req, res, next) {
        DiaDiem.find({})
            .then(diadiems => {
                res.render('diadiem/index', {
                    title: 'Điểm đến du lịch tại Cần Thơ',
                    diadiems: multipleMongooseToObject(diadiems)
                });
            })
            .catch(next);
    }

    // [GET] /du-lich/dia-diem/:slug
    async show(req, res, next) {
        let diadiem = await DiaDiem.findOne({slug: req.params.slug}).catch(next);
        let title = diadiem.name;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        DiaDiem.findOne({slug: req.params.slug})
            .then(diadiems => {
                res.render('diadiem/show', {
                    title: diadiems.name,
                    diadiems: mongooseToObject(diadiems),
                    slug: diadiems.slug,
                    comments: multipleMongooseToObject(comments),
                }); 
            })
            .catch(next);
    }

    // [GET] /du-lich/am-thuc
    amthuc(req, res, next) {
        AmThuc.find({})
            .then(amthucs => {
                res.render('amthuc/index', {
                    title: 'Ẩm thực Cần Thơ',
                    amthucs: multipleMongooseToObject(amthucs)
                });
            })
            .catch(next);
    }

    // [GET] /du-lich/am-thuc/:tag
    loaiAT(req, res, next) {
        AmThuc.find({tag: req.params.tag})
            .then(amthucs => {
                res.render('amthuc/index', {
                    title: 'Ở đây có các món ăn ngon 👈',
                    amthucs: multipleMongooseToObject(amthucs)
                }); 
            })
            .catch(next);
    }

    // [GET] /du-lich/am-thuc/:slug
    async showAT(req, res, next) {
        let amthuc = await AmThuc.findOne({slug: req.params.slug}).catch(next);
        let title = amthuc.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        AmThuc.findOne({slug: req.params.slug})
            .then(amthucs => {
                res.render('amthuc/show', {
                    title: amthucs.name,
                    amthucs: mongooseToObject(amthucs),
                    slug: amthucs.slug,
                    comments: multipleMongooseToObject(comments),
                }); 
            })
            .catch(next);
    }

    // [POST] /dia-diem/comment/:slug
    async commentDD(req, res, next) {
        let diadiems = await DiaDiem.findOne({slug: req.params.slug}).catch(next);
        const title = diadiems.name;
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

    // [POST] /am-thuc/comment/:slug
    async commentAT(req, res, next) {
        let amthucs = await AmThuc.findOne({slug: req.params.slug}).catch(next);
        const title = amthucs.title;
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

    // [PUT] /du-lich/like/:id
    async like(req, res, next) {
        let comments = await Comment.findById(req.params.id).catch(next);
        const like1 = comments.like;
        Comment.updateOne({ _id: req.params.id }, {like: like1+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [POST] /du-lich/goi-y
    goiY(req, res, next) {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
              console.log("A Multer error occurred when uploading."); 
            } else if (err) {
              console.log("An unknown error occurred when uploading." + err);
            }else{
                emailThanks.sendSimpleEmail({
                    receiverEmail: req.body.email,
                });
                let status = '';
                let diadiem = await DiaDiem.findOne({name: req.body.name}).catch(next);
                let amthuc = await AmThuc.findOne({title: req.body.name}).catch(next);
                if(diadiem || amthuc){
                    status = 'Đã có';
                }
                else{ status = 'Mới'; }
                const image = '/img/'+req.file.filename;
                const goiy = new GoiY({
                    name: req.body.name,
                    address: req.body.address,
                    image: image,
                    email: req.body.email,
                    status: status,
                });
                goiy
                    .save()
                    .then(() => res.redirect("back"))
                    .catch((error) => {});
            }
    
        });
    }

    // Quan Ly Dia Diem //

    // [GET] /admin/quan-ly-dia-diem
    async ql_diadiem(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let diadiems = await DiaDiem.find({}).sort({updatedAt: -1}).catch(next); 
        let deletedCount = await DiaDiem.countDocumentsDeleted({}); 
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            res.render("admin/ql_diadiem", {
                title: "Quản lý Điểm đến",
                admins: mongooseToObject(admins),
                deletedCount: (deletedCount),
                diadiems: multipleMongooseToObject(diadiems),
                dattours: multipleMongooseToObject(dattours),
            });
        }
        else { 
            req.session.back="/admin/quan-ly-dia-diem"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

     // [GET] /admin/quan-ly-dia-diem/thung-rac
     async trashDiaDiem(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            DiaDiem.findDeleted({})
                .then((diadiems) =>
                    res.render('admin/trash-dia-diem',{
                        title: 'Danh sách điểm đến đã xoá',
                        admins: mongooseToObject(admins),
                        diadiems: multipleMongooseToObject(diadiems),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-am-thuc"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/quan-ly-dia-diem/handle-form-action
    handleFormActionsDD(req, res, next){
        switch(req.body.action) {
            case 'delete':
                DiaDiem.delete({_id: {$in: req.body.diadiemIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/quan-ly-dia-diem/trash-form-action
    trashFormActionsDD(req, res, next){
        switch(req.body.action) {
            case 'delete':
                DiaDiem.addDiaDiem.deleteMany({_id: {$in: req.body.diadiemIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                DiaDiem.restore({_id: {$in: req.body.diadiemIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
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
        DiaDiem.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-dia-diem/:id
    updateDiaDiem(req, res, next) {
        DiaDiem.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-dia-diem"))
            .catch(next);
    }

    // [DELETE] /admin/quan-ly-dia-diem/:id/force
    forceDiaDiem(req, res, next) {
        DiaDiem.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }


    // [PATCH] /admin/quan-ly-dia-diem/:id/khoi-phuc
    restoreDiaDiem(req, res, next) {
        DiaDiem.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // Quan Ly Am Thuc //

    // [GET] /admin/quan-ly-am-thuc
    async ql_amthuc(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        const amthucs = await AmThuc.find({}).sort({updatedAt: -1}).catch(next);
        let deletedCount = await AmThuc.countDocumentsDeleted({}); 

        if (req.session.daDangNhap) {
            res.render("admin/ql_amthuc", {
                title: "Quản lý Ẩm thực",
                admins: mongooseToObject(admins),
                amthucs: multipleMongooseToObject(amthucs),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-am-thuc"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [GET] /admin/quan-ly-am-thuc/thung-rac
    async trashAmThuc(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            AmThuc.findDeleted({})
                .then((amthucs) =>
                    res.render('admin/trash-am-thuc',{
                        title: 'Danh sách ẩm thực đã xoá',
                        admins: mongooseToObject(admins),
                        amthucs: multipleMongooseToObject(amthucs),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-am-thuc"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [POST] /admin/quan-ly-am-thuc/handle-form-action
    handleFormActionsAT(req, res, next){
        switch(req.body.action) {
            case 'delete':
                AmThuc.delete({_id: {$in: req.body.amthucIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
        }
    }

    // [POST] /admin/quan-ly-am-thuc/trash-form-action
    trashFormActionsAT(req, res, next){
        switch(req.body.action) {
            case 'delete':
                AmThuc.deleteMany({_id: {$in: req.body.amthucIds}})
                    .then(()=> res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                AmThuc.restore({_id: {$in: req.body.amthucIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid!'});
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
        AmThuc.delete({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

    // [PUT] /admin/quan-ly-am-thuc/:id
    updateAmThuc(req, res, next) {
        AmThuc.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect("/admin/quan-ly-am-thuc"))
            .catch(next);
    }

    // [DELETE] /admin/quan-ly-am-thuc/:id/force
    forceAmThuc(req, res, next) {
        AmThuc.deleteOne({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }


    // [PATCH] /admin/quan-ly-am-thuc/:id/khoi-phuc
    restoreAmThuc(req, res, next) {
        AmThuc.restore({ _id: req.params.id })
            .then(() => res.redirect("back"))
            .catch(next);
    }

}

module.exports = new DuLichController();
