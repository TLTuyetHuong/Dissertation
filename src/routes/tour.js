const express = require('express');
const router = express.Router();

const tourController = require('../app/controllers/TourController');

router.post('/:slug',tourController.datTour);
router.get('/trai-nghiem/:slug', tourController.show);
router.get('/trai-nghiem',tourController.traiNghiem);
router.get('/lich-trinh-goi-y',tourController.lichTrinh);
router.get('/:slug',tourController.chiTiet);
router.get('/',tourController.index);

module.exports = router;