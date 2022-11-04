const TraiNghiem = require('../models/TraiNghiem');
const TinTuc = require('../models/TinTuc');
const { multipleMongooseToObject } = require('../../until/mongoose');

class GioiThieuController {
    // [GET] /kham-pha
    async index(req, res, next) {
        let trainghiems = await TraiNghiem.find({}).limit(9).catch(next);
        let tintucs = await TinTuc.find({}).limit(8).catch(next); 

        res.render('khampha', {
            title: 'Khám phá Cần Thơ 😋',
            trainghiems: multipleMongooseToObject(trainghiems),
            tintucs: multipleMongooseToObject(tintucs),
        });
    }

    // [GET] /kham-pha/:slug
    show(req, res) {
        if(req.params.slug == 'gioi-thieu-ve-thanh-pho-can-tho'){
            res.render('baiviets/gioi-thieu-ve-thanh-pho-can-tho', {title: 'Giới thiệu về Thành phố Cần Thơ'});
        }
        if(req.params.slug == 'van-hoa-&-lich-su'){
            res.render('baiviets/van-hoa-&-lich-su', {title: 'Văn hoá & Lịch sử'});
        }
        if(req.params.slug == 'lich-su-vung-dat-can-tho'){
            res.render('baiviets/lich-su-vung-dat-can-tho', {title: 'Lịch sử vùng đất Cần Thơ'});
        }
    }
}

module.exports = new GioiThieuController();
