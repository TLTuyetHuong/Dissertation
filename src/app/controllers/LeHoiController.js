const TinTuc = require('../models/TinTuc');
const Comment = require('../models/Comment');
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
    async show(req, res, next) {
        let lehoi = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        let title = lehoi.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        TinTuc.findOne({slug: req.params.slug})
            .then((tintucs) => {
                if(req.params.slug==tintucs.slug){
                    res.render('lehoi/'+req.params.slug, {
                        slug: tintucs.slug,
                        comments: multipleMongooseToObject(comments),
                        title: tintucs.title
                    })
                }
            })
            .catch(next);
    }

    // [POST] /le-hoi/:slug
    async comment(req, res, next) {
        let lehois = await TinTuc.findOne({slug: req.params.slug}).catch(next);
        const title = lehois.title;
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
            .then(() => res.redirect('back'))
            .catch((error) => {});
    }

    // [PUT] /le-hoi/like/:id
    async like(req, res, next) {
        let comments = await Comment.findById(req.params.id).catch(next);
        const like1 = comments.like;
        Comment.updateOne({ _id: req.params.id }, {like: like1+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }
    
}

module.exports = new LeHoiController();
