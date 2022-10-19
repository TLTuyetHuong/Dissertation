const express = require('express');
const router = express.Router();

const leHoiController = require('../app/controllers/LeHoiController');

router.get('/:slug', leHoiController.show);
router.get('/', leHoiController.index);

module.exports = router;
