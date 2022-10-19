const express = require('express');
const router = express.Router();

const duLichController = require('../app/controllers/DuLichController');

router.get('/dia-diem/:slug', duLichController.show);
router.get('/am-thuc',duLichController.amthuc);
router.get('/am-thuc/:tag',duLichController.loaiAT);
router.get('/dia-diem',duLichController.diadiem);

module.exports = router;