const express = require('express');
const { check } = require('prettier');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/tien-ich/:slug', siteController.tienIchInfo);
router.get('/tien-ich', siteController.tienIch);
router.get('/lien-he', siteController.lienHe);
router.get('/error400', siteController.error400);
router.get('/error500', siteController.error500);
router.post('/search', siteController.search);
router.get('/', siteController.index);

module.exports = router;
