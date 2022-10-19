
const { multipleMongooseToObject } = require('../../until/mongoose');

class GioiThieuController {
    // [GET] /kham-pha
    index(req, res) {
        res.render('khampha', {title: 'Khám phá Cần Thơ'})
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
