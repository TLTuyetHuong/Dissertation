const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const khachSanController = require('../app/controllers/KhachSanController');
const tinTucController = require('../app/controllers/TinTucController');
const authController = require('../app/controllers/AuthController');
const { verifySignUp } = require("../app/middlewares/verifySignUp");

// Quan ly Khach San
router.post('/quan-ly-khach-san/handle-form-action', khachSanController.handleFormActionsKS);
router.post('/quan-ly-khach-san/trash-form-action', khachSanController.trashFormActionsKS);
router.patch('/quan-ly-khach-san/:id/khoi-phuc', khachSanController.restoreKhachSan);
router.put('/quan-ly-khach-san/:id', khachSanController.updateKhachSan);
router.delete('/quan-ly-khach-san/:id/force', khachSanController.forceKhachSan);
router.delete('/quan-ly-khach-san/:id', khachSanController.deleteKhachSan);
router.post('/quan-ly-khach-san', khachSanController.addKhachSan);
router.get('/quan-ly-khach-san/:id/sua-khach-san', khachSanController.editKhachSan);
router.get('/quan-ly-khach-san/thung-rac', khachSanController.trashKhachSan);
router.get('/quan-ly-khach-san', khachSanController.ql_khachsan);

// Quan ly Comment
router.post('/quan-ly-comment/handle-form-action', adminController.handleFormActionsCmt);
router.post('/quan-ly-comment/trash-form-action', adminController.trashFormActionsCmt);
router.patch('/quan-ly-comment/:id/khoi-phuc', adminController.restoreComment);
router.delete('/quan-ly-comment/:id/force', adminController.forceComment);
router.delete('/quan-ly-comment/:id', adminController.deleteComment);
router.get('/quan-ly-comment/thung-rac', adminController.trashComment);
router.get('/quan-ly-comment', adminController.ql_comment);

// Quan ly Tour
router.post('/quan-ly-tour/handle-form-action', adminController.handleFormActionsTour);
router.post('/quan-ly-tour/trash-form-action', adminController.trashFormActionsTour);
router.patch('/quan-ly-tour/:id/khoi-phuc', adminController.restoreTour);
router.patch('/quan-ly-dat-tour/:id/khoi-phuc', adminController.restoreDatTour);
router.post('/quan-ly-dat-tour/handle-form-action', adminController.handleFormActionsDT);
router.post('/quan-ly-dat-tour/trash-form-action', adminController.trashFormActionsDT);
router.put('/quan-ly-tour/xem-chi-tiet/:id', adminController.updateDatTour);
router.put('/quan-ly-tour/:id', adminController.updateTour);
router.delete('/quan-ly-tour:id/force', adminController.forceTour);
router.delete('/quan-ly-dat-tour:id/force', adminController.forceDatTour);
router.delete('/quan-ly-tour/:id', adminController.deleteTour);
router.post('/quan-ly-tour', adminController.addTour);
router.get('/quan-ly-tour/:id/sua-tour', adminController.editTour);
router.get('/quan-ly-tour/xem-chi-tiet/:id', adminController.editDatTour);
router.get('/quan-ly-tour/danh-sach-khach-dat-tour', adminController.ds_tour);
router.get('/quan-ly-tour/thung-rac', adminController.trashTour);
router.get('/quan-ly-dat-tour/thung-rac', adminController.trashDatTour);
router.get('/quan-ly-dat-tour', adminController.ql_dattour);
router.get('/quan-ly-tour', adminController.ql_tour);

// Quan ly Tin Tuc
router.get('/quan-ly-lich-trinh-goi-y', tinTucController.ql_lichtrinh);
router.get('/quan-ly-trai-nghiem', tinTucController.ql_trainghiem);
router.get('/quan-ly-le-hoi', tinTucController.ql_lehoi);

router.post('/quan-ly-tin-tuc/handle-form-action', tinTucController.handleFormActionsTT);
router.post('/quan-ly-tin-tuc/trash-form-action', tinTucController.trashFormActionsTT);
router.patch('/quan-ly-tin-tuc/:id/khoi-phuc', tinTucController.restoreTinTuc);
router.put('/quan-ly-tin-tuc/:id', tinTucController.updateTinTuc);
router.delete('/quan-ly-tin-tuc/:id/force', tinTucController.forceTinTuc);
router.delete('/quan-ly-tin-tuc/:id', tinTucController.deleteTinTuc);
router.post('/quan-ly-tin-tuc', tinTucController.addTinTuc);
router.get('/quan-ly-tin-tuc/:id/sua-tin-tuc', tinTucController.editTinTuc);
router.get('/quan-ly-tin-tuc/thung-rac', tinTucController.trashTinTuc);
router.get('/quan-ly-tin-tuc', tinTucController.ql_tintuc);

// Quan ly Dia Diem
router.post('/quan-ly-dia-diem/handle-form-action', adminController.handleFormActionsDD);
router.post('/quan-ly-dia-diem/trash-form-action', adminController.trashFormActionsDD);
router.patch('/quan-ly-dia-diem/:id/khoi-phuc', adminController.restoreDiaDiem);
router.put('/quan-ly-dia-diem/:id', adminController.updateDiaDiem);
router.delete('/quan-ly-dia-diem/:id/force', adminController.forceDiaDiem);
router.delete('/quan-ly-dia-diem/:id', adminController.deleteDiaDiem);
router.post('/quan-ly-dia-diem', adminController.addDiaDiem);
router.get('/quan-ly-dia-diem/:id/sua-dia-diem', adminController.editDiaDiem);
router.get('/quan-ly-dia-diem/thung-rac', adminController.trashDiaDiem);
router.get('/quan-ly-dia-diem', adminController.ql_diadiem);

// Quan ly Am Thuc
router.post('/quan-ly-am-thuc/handle-form-action', adminController.handleFormActionsAT);
router.post('/quan-ly-am-thuc/trash-form-action', adminController.trashFormActionsAT);
router.patch('/quan-ly-am-thuc/:id/khoi-phuc', adminController.restoreAmThuc);
router.put('/quan-ly-am-thuc/:id', adminController.updateAmThuc);   // Sửa
router.delete('/quan-ly-am-thuc/:id/force', adminController.forceAmThuc);
router.delete('/quan-ly-am-thuc/:id', adminController.deleteAmThuc);    // Xoá
router.post('/quan-ly-am-thuc', adminController.addAmThuc); // Thêm
router.get('/quan-ly-am-thuc/:id/sua-am-thuc', adminController.editAmThuc); // Hiện trang Sửa
router.get('/quan-ly-am-thuc/thung-rac', adminController.trashAmThuc);
router.get('/quan-ly-am-thuc', adminController.ql_amthuc)   // Trang Quản lý Ẩm thực

// Admin
router.put('/avatar/:id', adminController.updateAvatar); 
router.put('/:id', adminController.updateAdmin);    // Cập nhật thông tin Admin
router.put('/doi-mat-khau/:id', adminController.changePassword); 
router.post('/danh-sach-admin/handle-form-action', adminController.handleFormActions);
router.post('/danh-sach-admin/trash-form-action', adminController.trashFormActions);
router.patch('/danh-sach-admin/:id/khoi-phuc', adminController.restoreAdmin);
router.delete('/danh-sach-admin /:id/force', adminController.forceAdmin);
router.delete('/danh-sach-admin/:id', adminController.deleteAdmin);
router.post('/quen-mat-khau', adminController.forgotPassword);  
router.post('/signup', adminController.signup); // Thêm Admin
router.post('/', adminController.login);    // Đăng nhập Admin
router.get('/signup', adminController.get_signup);  // Hiện trang Thêm admin
router.get('/login', adminController.get_login);    // Hiện trang Đăng nhập admin
router.get('/logout', adminController.logout);  // Đăng xuất
router.get('/:id/sua-thong-tin', adminController.editTTAdmin);  //Hiện trang cập nhật thông tin
router.get('/danh-sach-admin/thung-rac', adminController.trashAdmin);
router.get('/danh-sach-admin', adminController.ds_admin);  
router.get('/doi-mat-khau/:id', adminController.changePass); 
router.get('/quen-mat-khau', adminController.forgotPass);   // Quên mật khẩu
router.get('/', adminController.index);

module.exports = router;