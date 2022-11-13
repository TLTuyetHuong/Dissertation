const TinTuc = require('../models/TinTuc');
const { multipleMongooseToObject } = require('../../until/mongoose');

class LeHoiController {
    // [GET] /le-hoi
    index(req, res, next) {
        TinTuc.find({tag: 'le-hoi'})
            .then(lehois => {
                res.render('lehoi/index', {
                    title: 'Lễ hội Cần Thơ',
                    lehois: multipleMongooseToObject(lehois),
                })
            }).catch(next);
    }

    // [GET] /le-hoi/:slug
    show(req, res, next) {
        TinTuc.findOne({slug: req.params.slug})
            .then((tintucs) => {
                if(req.params.slug==tintucs.slug){
                    res.render('lehoi/'+req.params.slug, {title: tintucs.title})
                }
            })
            .catch(next);
    }
    
}

module.exports = new LeHoiController();
