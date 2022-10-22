const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const authController = require('../app/controllers/AuthController');
const { verifySignUp } = require("../app/middlewares/verifySignUp");

router.put('/quan-ly-dia-diem/:id', adminController.updateDiaDiem);
router.delete('/quan-ly-dia-diem/:id', adminController.deleteDiaDiem);
router.delete('/danh-sach-admin/:id', adminController.deleteAdmin);
router.get('/signup', adminController.get_signup);
router.get('/login', adminController.get_login);
router.get('/logout', adminController.logout);
router.get('/quan-ly-dia-diem/:id/sua-dia-diem', adminController.editDiaDiem);
router.get('/quan-ly-dia-diem', adminController.ql_diadiem);
router.get('/quan-ly-am-thuc', adminController.ql_amthuc);
router.get('/danh-sach-admin', adminController.ds_admin);
router.post('/signup', adminController.signup);
router.post('/quan-ly-dia-diem', adminController.addDiaDiem);
router.post('/', adminController.login);
router.get('/', adminController.index);

module.exports = router;