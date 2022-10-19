const TinTuc = require('../models/TinTuc');
const { multipleMongooseToObject } = require('../../until/mongoose');

class TinTucController {
    // [GET] /tin-tuc
    index(req, res, next) {
        TinTuc.find({})
            .then(tintucs => {
                res.render('tintucs', {
                    title: 'Tin Tức',
                    tintucs: multipleMongooseToObject(tintucs)
                });
            })
            .catch(next);
    }

    // [GET] /tin-tuc/:slug
    show(req, res, next) {
        TinTuc.findOne({slug: req.params.slug})
            .then((tintucs) => {
                if(req.params.slug=='khu-nghi-duong-gan-gui-thien-nhien-o-can-tho'){
                    res.render('baiviets/khu-nghi-duong-gan-gui-thien-nhien-o-can-tho', {title: tintucs.title})
                }
                if(req.params.slug=='viet-nam-trong-top-diem-den-vua-lam-vua-choi'){
                    res.render('baiviets/viet-nam-trong-top-diem-den-vua-lam-vua-choi', {title: tintucs.title})
                }
                if(req.params.slug=='cum-hop-tac-lien-ket-dong-bang-song-cuu-long-quang-ba-du-lich'){
                    res.render('baiviets/cum-hop-tac-lien-ket-dong-bang-song-cuu-long-quang-ba-du-lich', {title: tintucs.title})
                }
                if(req.params.slug=='dan-ca-tre-biet-len-can-an-moi-o-mien-tay'){
                    res.render('baiviets/dan-ca-tre-biet-len-can-an-moi-o-mien-tay', {title: tintucs.title})
                }
                if(req.params.slug=='cam-nang-du-lich-can-tho'){
                    res.render('baiviets/cam-nang-du-lich-can-tho', {title: tintucs.title})
                }
                if(req.params.slug=='thuc-day-phuc-hoi-du-lich-gan-voi-su-phat-trien-ben-vung'){
                    res.render('baiviets/thuc-day-phuc-hoi-du-lich-gan-voi-su-phat-trien-ben-vung', {title: tintucs.title})
                }
                if(req.params.slug=='phong-dien-phat-trien-trong-diem-du-lich-sinh-thai'){
                    res.render('baiviets/phong-dien-phat-trien-trong-diem-du-lich-sinh-thai', {title: tintucs.title})
                }
                if(req.params.slug=='can-tho-diem-den-thu-hut-du-khach-quoc-te'){
                    res.render('baiviets/can-tho-diem-den-thu-hut-du-khach-quoc-te', {title: tintucs.title})
                }
                if(req.params.slug=='day-manh-hop-tac-diem-den-du-lich-giua-khu-vuc-dbscl-voi-quang-ninh-ninh-binh-va-binh-dinh'){
                    res.render('baiviets/day-manh-hop-tac-diem-den-du-lich-giua-khu-vuc-dbscl-voi-quang-ninh-ninh-binh-va-binh-dinh', {title: tintucs.title})
                }
                if(req.params.slug=='cac-diem-vui-choi-o-phong-dien'){
                    res.render('baiviets/cac-diem-vui-choi-o-phong-dien', {title: tintucs.title})
                }
                if(req.params.slug=='soi-noi-cac-hoat-dong-the-thao-chao-mung-ngay-hoi-du-lich-sinh-thai-phong-dien'){
                    res.render('baiviets/soi-noi-cac-hoat-dong-the-thao-chao-mung-ngay-hoi-du-lich-sinh-thai-phong-dien', {title: tintucs.title})
                }
                if(req.params.slug=='bao-ton-va-phat-huy-van-hoa-cho-noi-cai-rang-gan-voi-phat-trien-du-lich'){
                    res.render('baiviets/bao-ton-va-phat-huy-van-hoa-cho-noi-cai-rang-gan-voi-phat-trien-du-lich', {title: tintucs.title})
                }

            })
            .catch(next);
    }
    
}

module.exports = new TinTucController();
