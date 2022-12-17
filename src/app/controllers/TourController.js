const emailService = require('../services/emailSevice');
const Admin = require('../models/Admin');
const Tour = require('../models/Tour');
const TinTuc = require('../models/TinTuc');
const DatTour = require('../models/DatTour');
const Comment = require('../models/Comment');
const { multipleMongooseToObject } = require('../../until/mongoose');
const { mongooseToObject } = require('../../until/mongoose');

class TourController {
    // [GET] /tour
    index(req, res, next) {
        Tour.find({})
            .then(tour => {
                res.render('tour/index', {
                    title: 'Tours',
                    tour: multipleMongooseToObject(tour)
                });
            })
            .catch(next);
    }

    // [GET] /tour/:slug
    async chiTiet(req, res, next) {
        let tour = await Tour.findOne({slug: req.params.slug}).catch(next);
        let title = tour.name;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        Tour.findOne({slug: req.params.slug})
            .then((tours) => {
                if(req.params.slug==tours.slug){
                    res.render('tour/'+req.params.slug, {
                        title: tours.name,
                        slug: tours.slug,
                        comments: multipleMongooseToObject(comments),
                        tours: mongooseToObject(tours)
                    });
                }
            })
            .catch(next);
    }

    // [POST] /tour/:slug
    async datTour(req, res, next) {
        const formData = req.body;
        const tour = await Tour.findOne({name: formData.nametour}).catch(next);
        const startingGate = tour.startingGate;
        const quantity = tour.quantity - (parseInt(formData.sm6) + parseInt(formData.f69) + parseInt(formData.lg9));
        const soChoDat = parseInt(formData.sm6) + parseInt(formData.f69) + parseInt(formData.lg9);
        if(soChoDat < tour.quantity){
            const str = formData.pricetour.slice(0,3) * 1000;
            const price75 = str * (75/100);
            const dattours = new DatTour(formData);
            dattours.total = (formData.f69 * price75) + (formData.lg9 * str);
            dattours.day = formData.day.slice(8,10) +'-'+ formData.day.slice(5,7) +'-'+ formData.day.slice(0,4);
            emailService.sendSimpleEmail({
                emailOwnerTour: formData.emailOwnerTour,
                receiverEmail: formData.email,
                patientName: formData.name,
                patientPhone: formData.phone,
                patientSM6: formData.sm6,
                patientF69: formData.f69,
                patientLG10: formData.lg9,
                nameTour: formData.nametour,
                priceTour: formData.pricetour,
                total: dattours.total.toLocaleString('vi', {style: 'currency', currency: 'VND' }),
                departureDay: dattours.day,
                startingGate: startingGate,
            });
            dattours
                .save()
                .then(() => {res.render('tour/thong-bao',{title: 'Thông báo'})})
                .catch((error) => {});
    
            Tour.updateOne({ _id: tour._id}, {quantity: quantity})
                .then(() => {res.render('tour/thong-bao',{title: 'Thông báo'})})
                .catch(next);
        }else{
            res.render('tour/thong-bao-het-cho',{
                title: 'Thông báo',
                slug: tour.slug,
                quantity: tour.quantity,
            })
        }
    }

    // [GET] /tour/khoang-gia/:slug
    async khoangGia(req, res, next) {
        let tour = await Tour.find({numberPrice: {$gt: 300000, $lt: 500000}});
        
        if(req.params.slug == '300000'){
            tour = await Tour.find({$and: [ { numberPrice: { $gt: 0 } }, { numberPrice: { $lt: 300000 } } ]});
        }else if (req.params.slug == '500000'){
            tour = await Tour.find({numberPrice: {$gt: 300000, $lt: 500000}});
        }else if (req.params.slug == '800000'){
            tour = await Tour.find({ $and: [ { numberPrice: { $gt: 500000 } }, { numberPrice: { $lt: 800000 } } ] });
        }else if (req.params.slug == '1100000'){
            tour = await Tour.find({$and: [ { numberPrice: { $gt: 800000 } }, { numberPrice: { $lt: 1100000 } } ]});
        }else if (req.params.slug == '1700000'){
            tour = await Tour.find({$and: [ { numberPrice: { $gt: 1100000 } }, { numberPrice: { $lt: 2000000 } } ]});
        }else tour = await Tour.find({numberPrice:{$gt:1700000,$lt:req.params.slug}});
        res.render('tour/index', {
            title: 'Tours',
            tour: multipleMongooseToObject(tour),
        });
    }

    // [GET] /tour/trai-nghiem/
    traiNghiem(req, res, next) {
        TinTuc.find({tag: 'trai-nghiem'})
            .then(trainghiems => {
                res.render('tour/trainghiem', {
                    title: 'Trải nghiệm',
                    trainghiems: multipleMongooseToObject(trainghiems)
                });
            })
            .catch(next);
    }

    // [GET] /tour/trai-nghiem/:slug
    async show(req, res, next) {
        let trainghiem = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        let title = trainghiem.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        TinTuc.findOne({slug: req.params.slug})
            .then((trainghiems) => {
                if(req.params.slug==trainghiems.slug){
                    res.render('baiviets/review/'+req.params.slug, {
                        title: trainghiems.title,
                        comments: multipleMongooseToObject(comments),
                        slug: trainghiems.slug,
                    })
                }
            })
            .catch(next);
    }

    // [GET] /tour/lich-trinh-goi-y/
    async lichTrinh(req, res, next) {
        let lichtrinhs = await TinTuc.find({tag: 'lich-trinh-goi-y'}).catch(next);

        res.render('tour/lichtrinhgoiy', {
            title: 'Lịch trình gợi ý',
            lichtrinhs: multipleMongooseToObject(lichtrinhs),
        });
    }

    // [GET] /tour/lich-trinh-goi-y/:slug
    async lichTrinhGY(req, res, next) {
        let lichtrinhs = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        const title = lichtrinhs.title;

        res.render('tour/lichtrinhgoiy/'+req.params.slug, {title: title})
    }

    // [POST] /tour/:slug
    async comment(req, res, next) {
        let tours = await Tour.findOne({slug: req.params.slug}).catch(next);
        let trainghiems = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        let title = '';
        if(tours){
            title = tours.name;
        }
        if(trainghiems){
            title = tours.title;
        }
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

    // [PUT] /tour/like/:id
    async like(req, res, next) {
        let comments = await Comment.findById(req.params.id).catch(next);
        const like1 = comments.like;
        Comment.updateOne({ _id: req.params.id }, {like: like1+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }
    
    // Quan Ly Tour //

    // [GET] /admin/quan-ly-tour
    async ql_tour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let tours = await Tour.find({}).sort({updatedAt: -1}).catch(next); 
        
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await Tour.countDocumentsDeleted({}); 
        if (req.session.daDangNhap) {
            res.render("admin/ql_tour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                tours: multipleMongooseToObject(tours),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
        
    }

    // [GET] /admin/quan-ly-tour/khoang-gia/:slug
    async khoangGiaQL(req, res, next) {
        let tours = await Tour.find({numberPrice: {$gt: 300000, $lt: 500000}});
        
        if(req.params.slug == '300000'){
            tours = await Tour.find({$and: [ { numberPrice: { $gt: 0 } }, { numberPrice: { $lt: 300000 } } ]});
        }else if (req.params.slug == '500000'){
            tours = await Tour.find({numberPrice: {$gt: 300000, $lt: 500000}});
        }else if (req.params.slug == '800000'){
            tours = await Tour.find({ $and: [ { numberPrice: { $gt: 500000 } }, { numberPrice: { $lt: 800000 } } ] });
        }else if (req.params.slug == '1100000'){
            tours = await Tour.find({$and: [ { numberPrice: { $gt: 800000 } }, { numberPrice: { $lt: 1100000 } } ]});
        }else if (req.params.slug == '1700000'){
            tours = await Tour.find({$and: [ { numberPrice: { $gt: 1100000 } }, { numberPrice: { $lt: 2000000 } } ]});
        }else tours = await Tour.find({numberPrice:{$gt:1700000,$lt:req.params.slug}});
        res.render('admin/ql_tour', {
            title: 'Quản lý Tours',
            tours: multipleMongooseToObject(tours),
        });
    }

    // [GET] /admin/quan-ly-tour/thung-rac
    async trashTour(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        if (req.session.daDangNhap) {
            Tour.findDeleted({})
                .then((tours) =>
                    res.render('admin/trash-tour',{
                        title: 'Danh sách tour đã xoá',
                        admins: mongooseToObject(admins),
                        tours: multipleMongooseToObject(tours),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-tour"; //req.originalUrl
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
        const dattours = await DatTour.find({}).sort({createdAt: -1});
        let deletedCount = await DatTour.countDocumentsDeleted({}); 
        if (req.session.daDangNhap) {
            res.render("admin/ql_dattour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-dat-tour"; //req.originalUrl
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
        }else if (req.params.slug == 'tong-so-tien-tang-dan'){
            dattours = await DatTour.find({}).sort({total: 1});
        }else if (req.params.slug == 'tong-so-tien-giam-dan'){
            dattours = await DatTour.find({}).sort({total: -1});
        }else dattours = await DatTour.find({status: 'Đã huỷ tour'});
        
        let deletedCount = await DatTour.countDocumentsDeleted({}); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_dattour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-dat-tour"; //req.originalUrl
            res.redirect("/admin/login");
        }
    }

    // [GET] /admin/quan-ly-tour/gia/:slug
    async sortPrice(req, res, next) {
        let admins = await Admin.findOne({email: req.session.email}).catch(next);
        let dattours = await DatTour.find({}).sort({createdAt: -1});
        let tours = await Tour.find({});
        if(req.params.slug == 'tang-dan'){
            tours = await Tour.find({}).sort({numberPrice: 1});
        }else{
            tours = await Tour.find({}).sort({numberPrice: -1});
        }
        
        let deletedCount = await Tour.countDocumentsDeleted({}); 
        
        if (req.session.daDangNhap) {
            res.render("admin/ql_tour", {
                title: "Quản lý Tours",
                admins: mongooseToObject(admins),
                dattours: multipleMongooseToObject(dattours),
                tours: multipleMongooseToObject(tours),
                deletedCount,
            });
        }
        else { 
            req.session.back="/admin/quan-ly-dat-tour"; //req.originalUrl
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
            req.session.back="/admin/quan-ly-dat-tour"; //req.originalUrl
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
                    res.render('admin/trash-dat-tour',{
                        title: 'Danh sách đơn đặt tour đã xoá',
                        admins: mongooseToObject(admins),
                        dattours: multipleMongooseToObject(dattours),
                    })
                ).catch(next);
        }
        else { 
            req.session.back="/admin/quan-ly-dat-tour"; //req.originalUrl
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
        await Tour.delete({ _id: req.params.id }).catch(next);
        await DatTour.delete({ _id: req.params.id }).catch(next);
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
}

module.exports = new TourController();
