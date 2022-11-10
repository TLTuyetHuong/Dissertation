const TinTuc = require('../models/TinTuc');
const Comment = require('../models/Comment');
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
    async show(req, res, next) {
        let tintuc = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        let title = tintuc.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        TinTuc.findOne({slug: req.params.slug})
            .then((tintucs) => {
                if(req.params.slug==tintucs.slug){
                    res.render('baiviets/tintuc/'+req.params.slug, {
                        title: tintucs.title,
                        slug: tintucs.slug,
                        comments: multipleMongooseToObject(comments),
                    })
                }
            })
            .catch(next);
    }

    // [POST] /tin-tuc/:slug
    async comment(req, res, next) {
        let tintucs = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        const title = tintucs.title;
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
            .then(() => res.status(403).end())
            .catch((error) => {});
    }

    // [PUT] /tin-tuc/like/:id
    async like(req, res, next) {
        let comments = await Comment.findById(req.params.id).catch(next);
        const like1 = comments.like;
        Comment.updateOne({ _id: req.params.id }, {like: like1+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }
}

module.exports = new TinTucController();
