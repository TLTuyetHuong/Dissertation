const emailService = require('../services/emailSevice');
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
            .then(tours => {
                res.render('tour/index', {
                    title: 'Tours',
                    tours: multipleMongooseToObject(tours)
                });
            })
            .catch(next);
    }

    // [GET] /tour/:slug
    async chiTiet(req, res, next) {
        let tour = await Tour.findOne({slug: req.params.slug}).catch(next);
        let title = tour.title;
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
        const str = formData.pricetour.slice(0,3) * 1000;
        const price75 = str * (75/100);
        const dattours = new DatTour(formData);
        dattours.total = (formData.f69 * price75) + (formData.lg9 * str);
        dattours.day = formData.day.slice(8,10) +'-'+ formData.day.slice(5,7) +'-'+ formData.day.slice(0,4);
        emailService.sendSimpleEmail({
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
            .then(() => res.render('tour/thong-bao'))
            .catch((error) => {});
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
        const title = '';
        if(tours){
            title = tours.title;
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
    
}

module.exports = new TourController();
