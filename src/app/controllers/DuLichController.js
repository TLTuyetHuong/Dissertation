const DiaDiem = require('../models/DiaDiem');
const AmThuc = require('../models/AmThuc');
const { multipleMongooseToObject } = require('../../until/mongoose');
const { mongooseToObject } = require('../../until/mongoose');

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

    // [GET] /du-lich/dia-diem/:slug
    async show(req, res, next) {
        DiaDiem.findOne({slug: req.params.slug})
            .then(diadiems => {
                res.render('diadiem/show', {
                    title: diadiem.name,
                    diadiems: mongooseToObject(diadiems)
                }); 
            })
            .catch(next);
    }
}

module.exports = new DuLichController();
