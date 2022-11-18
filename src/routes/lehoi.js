const express = require('express');
const router = express.Router();

const leHoiController = require('../app/controllers/LeHoiController');

router.put('/like/:id', leHoiController.like);
router.post('/comment/:slug', leHoiController.comment);
router.get('/:slug', leHoiController.show);
router.get('/', leHoiController.index);

module.exports = router;
