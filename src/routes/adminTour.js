const express = require('express');
const router = express.Router();

const adminTourController = require('../app/controllers/AdminTourController');

// Quan ly Tour
router.post('/quan-ly-tour/handle-form-action', adminTourController.handleFormActionsTour);
router.post('/quan-ly-tour/trash-form-action', adminTourController.trashFormActionsTour);
router.patch('/quan-ly-tour/:id/khoi-phuc', adminTourController.restoreTour);
router.patch('/quan-ly-dat-tour/:id/khoi-phuc', adminTourController.restoreDatTour);
router.post('/quan-ly-dat-tour/handle-form-action', adminTourController.handleFormActionsDT);
router.post('/quan-ly-dat-tour/trash-form-action', adminTourController.trashFormActionsDT);
router.put('/quan-ly-tour/xem-chi-tiet/:id', adminTourController.updateDatTour);
router.put('/quan-ly-tour/:id', adminTourController.updateTour);
router.delete('/quan-ly-tour/:id/force', adminTourController.forceTour);
router.delete('/quan-ly-dat-tour/:id/force', adminTourController.forceDatTour);
router.delete('/quan-ly-tour/:id', adminTourController.deleteTour);
router.post('/quan-ly-tour', adminTourController.addTour);
router.get('/quan-ly-tour/:id/sua-tour', adminTourController.editTour);
router.get('/quan-ly-tour/xem-chi-tiet/:id', adminTourController.editDatTour);
router.get('/quan-ly-dat-tour/trang-thai/:slug', adminTourController.statusDatTour);
router.get('/quan-ly-tour/danh-sach-khach-dat-tour', adminTourController.ds_tour);
router.get('/quan-ly-tour/thung-rac', adminTourController.trashTour);
router.get('/quan-ly-dat-tour/thung-rac', adminTourController.trashDatTour);
router.get('/quan-ly-dat-tour', adminTourController.ql_dattour);
router.get('/quan-ly-tour', adminTourController.ql_tour);

router.get('/:id/sua-thong-tin', adminTourController.editTTAdmin); 
router.get('/', adminTourController.index);

module.exports = router;
