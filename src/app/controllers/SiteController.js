const DiaDiem = require('../models/DiaDiem');
const Tour = require('../models/Tour');
const TinTuc = require('../models/TinTuc');
const AmThuc = require('../models/AmThuc');
const { multipleMongooseToObject } = require('../../until/mongoose');
const { validationResult } = require('express-validator');
const passport = require('passport');

class SiteController {
    // [GET] /
    async index(req, res, next) {
        let tours = await Tour.find({}).limit(9).catch(next);
        let places = await DiaDiem.find({}).limit(9).catch(next); 
        let tintucs = await TinTuc.find({}).limit(9).catch(next); 
        let amthucs = await AmThuc.find({}).limit(9).catch(next); 
        // console.log("tours: ", tours.map(tour=>tour.toObject).map(tour=>tour.name));
        // console.log("places: ", places);
        
        res.render('home', {
            title: 'Quảng bá du lịch và ẩm thực Thành phố Cần Thơ 😋',
            places: multipleMongooseToObject(places),
            tours: multipleMongooseToObject(tours),
            tintucs: multipleMongooseToObject(tintucs),
            amthucs: multipleMongooseToObject(amthucs)
        });
    }

    // [GET] /search
    search(req, res) {
        res.render('search');
    }

    // [GET] /error500
    error500(req, res){
        res.render('error500', {title: 'ERROR 500'});
    }

    // [GET] /error400
    error400(req, res){
        res.render('error400', {title: 'ERROR 400'});
    }

    // [GET] /lien-he
    lienhe(req, res){
        res.render('lienhe', {title: 'Liên Hệ'});
    }

}

module.exports = new SiteController();
