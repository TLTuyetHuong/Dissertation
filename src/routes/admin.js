const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const authController = require('../app/controllers/AuthController');
const { verifySignUp } = require("../app/middlewares/verifySignUp");

// Quan ly Khach San
router.put('/quan-ly-khach-san/:id', adminController.updateKhachSan);
router.delete('/quan-ly-khach-san/:id', adminController.deleteKhachSan);
router.post('/quan-ly-khach-san', adminController.addKhachSan);
router.get('/quan-ly-khach-san/:id/sua-khach-san', adminController.editKhachSan);
router.get('/quan-ly-khach-san', adminController.ql_khachsan);

// Quan ly Comment
router.get('/quan-ly-comment', adminController.ql_comment);

// Quan ly Tour
router.put('/quan-ly-tour/xem-chi-tiet/:id', adminController.updateDatTour);
router.put('/quan-ly-tour/:id', adminController.updateTour);
router.delete('/quan-ly-tour/:id', adminController.deleteTour);
router.post('/quan-ly-tin-tuc', adminController.addTour);
router.get('/quan-ly-tour/:id/sua-tour', adminController.editTour);
router.get('/quan-ly-tour/xem-chi-tiet/:id', adminController.editDatTour);
router.get('/quan-ly-tour/danh-sach-khach-dat-tour', adminController.ds_tour);
router.get('/quan-ly-dat-tour', adminController.ql_dattour);
router.get('/quan-ly-tour', adminController.ql_tour);

// Quan ly Tin Tuc
router.put('/quan-ly-tin-tuc/:id', adminController.updateTinTuc);
router.delete('/quan-ly-tin-tuc/:id', adminController.deleteTinTuc);
router.post('/quan-ly-tin-tuc', adminController.addTinTuc);
router.get('/quan-ly-tin-tuc/:id/sua-tin-tuc', adminController.editTinTuc);
router.get('/quan-ly-tin-tuc', adminController.ql_tintuc);

// Quan ly Dia Diem
router.put('/quan-ly-dia-diem/:id', adminController.updateDiaDiem);
router.delete('/quan-ly-dia-diem/:id', adminController.deleteDiaDiem);
router.post('/quan-ly-dia-diem', adminController.addDiaDiem);
router.get('/quan-ly-dia-diem/:id/sua-dia-diem', adminController.editDiaDiem);
router.get('/quan-ly-dia-diem', adminController.ql_diadiem);

// Quan ly Am Thuc
router.put('/quan-ly-am-thuc/:id', adminController.updateAmThuc);   // Sửa
router.delete('/quan-ly-am-thuc/:id', adminController.deleteAmThuc);    // Xoá
router.post('/quan-ly-am-thuc', adminController.addAmThuc); // Thêm
router.get('/quan-ly-am-thuc/:id/sua-am-thuc', adminController.editAmThuc); // Hiện trang Sửa
router.get('/quan-ly-am-thuc', adminController.ql_amthuc)   // Trang Quản lý Ẩm thực

// Admin
router.put('/avatar/:id', adminController.updateAvatar); 
router.put('/:id', adminController.updateAdmin);    // Cập nhật thông tin Admin
router.put('/doi-mat-khau/:id', adminController.changePassword); 
router.delete('/danh-sach-admin/:id', adminController.deleteAdmin);
router.post('/quen-mat-khau', adminController.forgotPassword);  
router.post('/signup', adminController.signup); // Thêm Admin
router.post('/', adminController.login);    // Đăng nhập Admin
router.get('/signup', adminController.get_signup);  // Hiện trang Thêm admin
router.get('/login', adminController.get_login);    // Hiện trang Đăng nhập admin
router.get('/logout', adminController.logout);  // Đăng xuất
router.get('/:id/sua-thong-tin', adminController.editTTAdmin);  //Hiện trang cập nhật thông tin
router.get('/danh-sach-admin', adminController.ds_admin);  
router.get('/doi-mat-khau/:id', adminController.changePass); 
router.get('/quen-mat-khau', adminController.forgotPass);   // Quên mật khẩu
router.get('/', adminController.index);

module.exports = router;