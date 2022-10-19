const express = require('express');
const { check } = require('prettier');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/error400', siteController.error400);
router.get('/error500', siteController.error500);
router.get('/search', siteController.search);
router.get('/', siteController.index);

module.exports = router;
