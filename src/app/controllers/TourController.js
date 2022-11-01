const emailService = require('../services/emailSevice');
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
                    res.render('tour/'+req.params.slug, {
                        title: tours.name,
                        tours: mongooseToObject(tours)
                    });
                }
            })
            .catch(next);
    }

    // [POST] /tour/:slug
    datTour(req, res, next) {
        const formData = req.body;
        const str = formData.pricetour.slice(0,3) * 1000;
        const price75 = str * (75/100);
        const dattours = new DatTour(formData);
        dattours.total = (formData.f69 * price75) + (formData.lg9 * str);
        emailService.sendSimpleEmail({
            receiverEmail: formData.email,
            patientName: formData.name,
            patientPhone: formData.phone,
            patientSM6: formData.sm6,
            patientF69: formData.f69,
            patientLG10: formData.lg9,
            nameTour: formData.nametour,
            priceTour: formData.pricetour,
            total: dattours.total,
        })
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
                if(req.params.slug==trainghiems.slug){
                    res.render('baiviets/'+req.params.slug, {title: trainghiems.name})
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
