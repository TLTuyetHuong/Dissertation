const express = require('express');
const router = express.Router();

const tinTucController = require('../app/controllers/TinTucController');

// Trai Nghiem
// router.get('/trai-nghiem/:slug', tourController.show);

router.put('/like/:id', tinTucController.like);
router.post('/comment/:slug', tinTucController.comment);
router.get('/:slug', tinTucController.show);
router.get('/', tinTucController.index);

module.exports = router;
