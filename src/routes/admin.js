const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const khachSanController = require('../app/controllers/KhachSanController');
const tinTucController = require('../app/controllers/TinTucController');
const tourController = require('../app/controllers/TourController');
const duLichController = require('../app/controllers/DuLichController');
const authController = require('../app/controllers/AuthController');
const { verifySignUp } = require("../app/middlewares/verifySignUp");

// Quan ly Goi Y
router.post('/quan-ly-goi-y/handle-form-action', adminController.handleFormActionsGoiY);
router.post('/quan-ly-goi-y/trash-form-action', adminController.trashFormActionsGoiY);
router.patch('/quan-ly-goi-y/:id/khoi-phuc', adminController.restoreGoiY);
router.put('/quan-ly-goi-y/trang-thai/:id', adminController.updateGoiY);
router.delete('/quan-ly-goi-y/:id/force', adminController.forceGoiY);
router.delete('/quan-ly-goi-y/:id', adminController.deleteGoiY);
router.get('/quan-ly-goi-y/thung-rac', adminController.trashGoiY);
router.get('/quan-ly-goi-y', adminController.ql_goiy);

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
router.post('/quan-ly-tour/handle-form-action', tourController.handleFormActionsTour);
router.post('/quan-ly-tour/trash-form-action', tourController.trashFormActionsTour);
router.patch('/quan-ly-tour/:id/khoi-phuc', tourController.restoreTour);
router.patch('/quan-ly-dat-tour/:id/khoi-phuc', tourController.restoreDatTour);
router.post('/quan-ly-dat-tour/handle-form-action', tourController.handleFormActionsDT);
router.post('/quan-ly-dat-tour/trash-form-action', tourController.trashFormActionsDT);
router.put('/quan-ly-tour/xem-chi-tiet/:id', tourController.updateDatTour);
router.put('/quan-ly-tour/:id', tourController.updateTour);
router.delete('/quan-ly-tour:id/force', tourController.forceTour);
router.delete('/quan-ly-dat-tour:id/force', tourController.forceDatTour);
router.delete('/quan-ly-tour/:id', tourController.deleteTour);
router.post('/quan-ly-tour', tourController.addTour);
router.get('/quan-ly-tour/:id/sua-tour', tourController.editTour);
router.get('/quan-ly-tour/xem-chi-tiet/:id', tourController.editDatTour);
router.get('/quan-ly-tour/danh-sach-khach-dat-tour', tourController.ds_tour);
router.get('/quan-ly-tour/thung-rac', tourController.trashTour);
router.get('/quan-ly-dat-tour/thung-rac', tourController.trashDatTour);
router.get('/quan-ly-dat-tour', tourController.ql_dattour);
router.get('/quan-ly-tour', tourController.ql_tour);

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
router.post('/quan-ly-dia-diem/handle-form-action', duLichController.handleFormActionsDD);
router.post('/quan-ly-dia-diem/trash-form-action', duLichController.trashFormActionsDD);
router.patch('/quan-ly-dia-diem/:id/khoi-phuc', duLichController.restoreDiaDiem);
router.put('/quan-ly-dia-diem/:id', duLichController.updateDiaDiem);
router.delete('/quan-ly-dia-diem/:id/force', duLichController.forceDiaDiem);
router.delete('/quan-ly-dia-diem/:id', duLichController.deleteDiaDiem);
router.post('/quan-ly-dia-diem', duLichController.addDiaDiem);
router.get('/quan-ly-dia-diem/:id/sua-dia-diem', duLichController.editDiaDiem);
router.get('/quan-ly-dia-diem/thung-rac', duLichController.trashDiaDiem);
router.get('/quan-ly-dia-diem', duLichController.ql_diadiem);

// Quan ly Am Thuc
router.post('/quan-ly-am-thuc/handle-form-action', duLichController.handleFormActionsAT);
router.post('/quan-ly-am-thuc/trash-form-action', duLichController.trashFormActionsAT);
router.patch('/quan-ly-am-thuc/:id/khoi-phuc', duLichController.restoreAmThuc);
router.put('/quan-ly-am-thuc/:id', duLichController.updateAmThuc);   // Sửa
router.delete('/quan-ly-am-thuc/:id/force', duLichController.forceAmThuc);
router.delete('/quan-ly-am-thuc/:id', duLichController.deleteAmThuc);    // Xoá
router.post('/quan-ly-am-thuc', duLichController.addAmThuc); // Thêm
router.get('/quan-ly-am-thuc/:id/sua-am-thuc', duLichController.editAmThuc); // Hiện trang Sửa
router.get('/quan-ly-am-thuc/thung-rac', duLichController.trashAmThuc);
router.get('/quan-ly-am-thuc', duLichController.ql_amthuc)   // Trang Quản lý Ẩm thực

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
router.get('/quan-ly-thung-rac', adminController.ql_thungrac);
router.get('/', adminController.index);

module.exports = router;