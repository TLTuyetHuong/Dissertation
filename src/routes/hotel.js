const express = require('express');
const router = express.Router();

const hotelController = require('../app/controllers/KhachSanController');

router.put('/like/:id', hotelController.like);
router.post('/comment/:slug', hotelController.comment);
router.get('/:slug', hotelController.show);
router.get('/', hotelController.index);

module.exports = router;
