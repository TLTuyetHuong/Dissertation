const express = require('express');
const router = express.Router();

const duLichController = require('../app/controllers/DuLichController');

router.put('/like/:id',duLichController.like);

// Ẩm Thực
router.post('/am-thuc/comment/:slug',duLichController.commentAT);
router.get('/am-thuc/loai/:tag',duLichController.loaiAT);
router.get('/am-thuc/:slug', duLichController.showAT);
router.get('/am-thuc',duLichController.amthuc);

// Địa Điểm
router.post('/dia-diem/comment/:slug',duLichController.commentDD);
router.get('/dia-diem/:slug', duLichController.show);
router.get('/dia-diem',duLichController.diadiem);

module.exports = router;