const express = require('express');
const router = express.Router();

const tourController = require('../app/controllers/TourController');

router.put('/trai-nghiem/like/:id', tourController.like);
router.put('/like/:id', tourController.like);
// router.post('/trai-nghiem/comment/:slug',tourController.comment);
router.post('/comment/:slug',tourController.comment);
router.post('/:slug',tourController.datTour);
router.get('/trai-nghiem/:slug', tourController.show);
router.get('/trai-nghiem',tourController.traiNghiem);
router.get('/lich-trinh-goi-y/:slug',tourController.lichTrinhGY);
router.get('/lich-trinh-goi-y',tourController.lichTrinh);
router.get('/khoang-gia/:slug',tourController.khoangGia);
router.get('/:slug',tourController.chiTiet);
router.get('/',tourController.index);

module.exports = router;