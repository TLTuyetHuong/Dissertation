const express = require('express');
const router = express.Router();

const tinTucController = require('../app/controllers/TinTucController');

router.put('/like/:id', tinTucController.like);
router.post('/comment/:slug', tinTucController.comment);
router.get('/:slug', tinTucController.show);
router.get('/', tinTucController.index);

module.exports = router;
