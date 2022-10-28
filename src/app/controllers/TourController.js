// const emailService = require('../services/emailSevice');
const Tour = require('../models/Tour');
const DatTour = require('../models/DatTour');
const TraiNghiem = require('../models/TraiNghiem');
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
    chiTiet(req, res, next) {
        Tour.findOne({slug: req.params.slug})
            .then((tours) => {
                if(req.params.slug==tours.slug){
                    res.render('tour/can-tho-mot-ngay-tay-do', {
                        title: 'Cần Thơ - Một ngày Tây Đô',
                        tours: mongooseToObject(tours)
                    });
                }
            })
            .catch(next);
    }

    // [POST] /tour/:slug
    datTour(req, res, next) {
        const formData = req.body;
        console.log(formData);
        // await emailService.sendSimpleEmail(formData.email)
        const dattours = new DatTour(formData);
        dattours
            .save()
            .then(() => res.redirect("back"))
            .catch((error) => {});
    }

    // [GET] /tour/trai-nghiem/
    traiNghiem(req, res, next) {
        TraiNghiem.find({})
            .then(trainghiems => {
                res.render('tour/trainghiem', {
                    title: 'Trải nghiệm',
                    trainghiems: multipleMongooseToObject(trainghiems)
                });
            })
            .catch(next);
    }

    // [GET] /tour/trai-nghiem/:slug
    show(req, res, next) {
        TraiNghiem.findOne({slug: req.params.slug})
            .then((trainghiems) => {
                if(req.params.slug=='review-cuc-co-tam-kinh-nghiem-di-con-son-can-tho'){
                    res.render('baiviets/review-cuc-co-tam-kinh-nghiem-di-con-son-can-tho', {title: trainghiems.name})
                }
                if(req.params.slug=='review-cam-trai-can-tho-va-nhung-trai-nghiem-thu-vi-co-mot-khong-hai'){
                    res.render('baiviets/review-cam-trai-can-tho-va-nhung-trai-nghiem-thu-vi-co-mot-khong-hai', {title: trainghiems.name})
                }
                if(req.params.slug=='review-an-sap-can-tho-khi-kham-pha-2-cho-dem-noi-tieng'){
                    res.render('baiviets/review-an-sap-can-tho-khi-kham-pha-2-cho-dem-noi-tieng', {title: trainghiems.name})
                }
                if(req.params.slug=='review-chat-luong-vinpearl-can-tho-va-cach-dat-phong-gia-re'){
                    res.render('baiviets/review-chat-luong-vinpearl-can-tho-va-cach-dat-phong-gia-re', {title: trainghiems.name})
                }
                if(req.params.slug=='review-ly-do-ban-nen-den-cho-noi-cai-rang-mot-lan'){
                    res.render('baiviets/review-ly-do-ban-nen-den-cho-noi-cai-rang-mot-lan', {title: trainghiems.name})
                }
                if(req.params.slug=='kham-pha-net-dac-sac-cua-cho-noi-cai-rang-chon-mien-tay-song-nuoc'){
                    res.render('baiviets/kham-pha-net-dac-sac-cua-cho-noi-cai-rang-chon-mien-tay-song-nuoc', {title: 'Khám phá nét đặc sắc của Chợ nổi Cái Răng chốn miền Tây sông nước'})
                }
                if(req.params.slug=='review-kinh-nghiem-di-can-tho-tu-tuc-sieu-tiet-kiem'){
                    res.render('baiviets/review-kinh-nghiem-di-can-tho-tu-tuc-sieu-tiet-kiem', {title: trainghiems.name})
                }
            })
            .catch(next);
    }

    // [GET] /tour/lich-trinh-goi-y/
    lichTrinh(req, res, next) {
        res.render('tour/lichtrinhgoiy', {title: 'Lịch trình gợi ý'})
    }
}

module.exports = new TourController();
