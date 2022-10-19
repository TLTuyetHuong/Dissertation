const TinTuc = require('../models/TinTuc');
const { multipleMongooseToObject } = require('../../until/mongoose');

class LeHoiController {
    // [GET] /le-hoi
    index(req, res, next) {
        res.render('lehoi/index', {title: 'Lễ hội Cần Thơ'})
    }

    // [GET] /le-hoi/:slug
    show(req, res, next) {
        TinTuc.findOne({slug: req.params.slug})
            .then((tintucs) => {
                if(req.params.slug=='le-hoi-banh-dan-gian-nam-bo'){
                    res.render('lehoi/le-hoi-banh-dan-gian-nam-bo', {title: 'Lễ hội bánh Dân gian Nam Bộ'})
                }
                if(req.params.slug=='hoa-minh-vao-hoi-hoa-dang-can-tho'){
                    res.render('lehoi/hoa-minh-vao-hoi-hoa-dang-can-tho', {title: 'Hoà mình vào Hội hoa đăng Cần Thơ'})
                }
                if(req.params.slug=='le-hoi-trai-cay-tan-loc'){
                    res.render('lehoi/le-hoi-trai-cay-tan-loc', {title: 'Lễ hội Trái cây Tân Lộc'})
                }
                if(req.params.slug=='le-hoi-ky-yen-dinh-binh-thuy'){
                    res.render('lehoi/le-hoi-ky-yen-dinh-binh-thuy', {title: 'Lễ hội Kỳ Yên đình Bình Thuỷ'})
                }
                if(req.params.slug=='le-hoi-chua-ong-can-tho'){
                    res.render('lehoi/le-hoi-chua-ong-can-tho', {title: 'Lễ hội Chùa Ông Cần Thơ'})
                }
                if(req.params.slug=='le-cholchonam-thomay-va-nhung-tap-tuc-dac-sac-cua-nguoi-khmer'){
                    res.render('lehoi/le-cholchonam-thomay-va-nhung-tap-tuc-dac-sac-cua-nguoi-khmer', {title: 'Lễ Cholchonam Thomay và những tập tục đặc sắc của người Khmer'})
                }
                if(req.params.slug=='dac-sac-le-hoi-ok-om-bok-cua-dong-bao-khmer-tai-can-tho'){
                    res.render('lehoi/dac-sac-le-hoi-ok-om-bok-cua-dong-bao-khmer-tai-can-tho', {title: 'Đặc sắc Lễ hội Ok Om Bok của đồng bào Khmer tại Cần Thơ'})
                }
                if(req.params.slug=='le-hoi-via-ba-thien-hau'){
                    res.render('lehoi/le-hoi-via-ba-thien-hau', {title: 'Lễ vía Bà Thiên Hậu và nét văn hóa của người Hoa ở Cần Thơ'})
                }
                if(req.params.slug=='viet-nam-trong-top-diem-den-vua-lam-vua-choi'){
                    res.render('baiviets/viet-nam-trong-top-diem-den-vua-lam-vua-choi', {title: tintucs.title})
                }
            })
            .catch(next);
    }
    
}

module.exports = new LeHoiController();
