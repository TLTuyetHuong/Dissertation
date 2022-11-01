const express = require('express');
const router = express.Router();

const duLichController = require('../app/controllers/DuLichController');

// Ẩm Thực
router.get('/am-thuc/:slug', duLichController.showAT);
router.get('/am-thuc',duLichController.amthuc);
router.get('/am-thuc/:tag',duLichController.loaiAT);

// Địa Điểm
router.get('/dia-diem/:slug', duLichController.show);
router.get('/dia-diem',duLichController.diadiem);

module.exports = router;