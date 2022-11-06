const express = require('express');
const router = express.Router();

const tinTucController = require('../app/controllers/TinTucController');

router.post('/:slug', tinTucController.comment);
router.get('/:slug', tinTucController.show);
router.get('/', tinTucController.index);

module.exports = router;
