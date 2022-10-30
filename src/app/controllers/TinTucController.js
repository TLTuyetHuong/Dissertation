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
                if(req.params.slug==tintucs.slug){
                    res.render('baiviets/'+req.params.slug, {title: tintucs.title})
                }
            })
            .catch(next);
    }
    
}

module.exports = new TinTucController();
