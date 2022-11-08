const DiaDiem = require('../models/DiaDiem');
const AmThuc = require('../models/AmThuc');
const Comment = require('../models/Comment');
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

    // [GET] /du-lich/dia-diem/:slug
    async show(req, res, next) {
        let diadiem = await DiaDiem.findOne({slug: req.params.slug}).catch(next);
        let title = diadiem.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        DiaDiem.findOne({slug: req.params.slug})
            .then(diadiems => {
                res.render('diadiem/show', {
                    title: diadiems.name,
                    diadiems: mongooseToObject(diadiems),
                    slug: diadiems.slug,
                    comments: multipleMongooseToObject(comments),
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

    // [GET] /du-lich/am-thuc/:slug
    async showAT(req, res, next) {
        let amthuc = await AmThuc.findOne({slug: req.params.slug}).catch(next);
        let title = amthuc.title;
        let comments = await Comment.find({posts: title}).sort({createdAt: -1});
        AmThuc.findOne({slug: req.params.slug})
            .then(amthucs => {
                res.render('amthuc/show', {
                    title: amthucs.name,
                    amthucs: mongooseToObject(amthucs),
                    slug: amthucs.slug,
                    comments: multipleMongooseToObject(comments),
                }); 
            })
            .catch(next);
    }

    // [POST] /dia-diem/comment/:slug
    async commentDD(req, res, next) {
        let diadiems = await DiaDiem.findOne({slug: req.params.slug}).catch(next);
        const title = diadiems.title;
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

    // [POST] /am-thuc/comment/:slug
    async commentAT(req, res, next) {
        let amthucs = await AmThuc.findOne({slug: req.params.slug}).catch(next);
        const title = amthucs.title;
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

    // [PUT] /du-lich/like/:id
    async like(req, res, next) {
        let comments = await Comment.findById(req.params.id).catch(next);
        const like1 = comments.like;
        Comment.updateOne({ _id: req.params.id }, {like: like1+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }

}

module.exports = new DuLichController();
