const KhachSan = require('../models/KhachSan');
const Comment = require('../models/Comment');
const { multipleMongooseToObject } = require('../../until/mongoose');

class KhachSanController {
    // [GET] /khach-san
    index(req, res, next) {
        KhachSan.find({})
            .then(khachsans => {
                res.render('khachsan/index', {
                    title: 'Ở đâu tại Cần Thơ',
                    khachsans: multipleMongooseToObject(khachsans)
                });
            })
            .catch(next);
    }

    // [GET] /khach-san/:slug
    async show(req, res, next) {
        let khachsan = await KhachSan.findOne({slug: req.params.slug}).catch(next);
        let title = khachsan.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        KhachSan.findOne({slug: req.params.slug})
            .then((khachsans) => {
                if(req.params.slug==khachsans.slug){
                    res.render('baiviets/homestay/'+req.params.slug, {
                        title: khachsans.title,
                        slug: khachsans.slug,
                        comments: multipleMongooseToObject(comments),
                    })
                }
            })
            .catch(next);
    }

    // [POST] /khach-san/:slug
    async comment(req, res, next) {
        let khachsans = await KhachSan.findOne({slug: req.params.slug}).catch(next);
        const title = khachsans.title;
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

    // [PUT] /khach-san/like/:id
    async like(req, res, next) {
        let comments = await Comment.findById(req.params.id).catch(next);
        const like1 = comments.like;
        Comment.updateOne({ _id: req.params.id }, {like: like1+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }
}

module.exports = new KhachSanController();
