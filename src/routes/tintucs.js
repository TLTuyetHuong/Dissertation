const express = require('express');
const router = express.Router();

const tinTucController = require('../app/controllers/TinTucController');

router.put('/sub-comment/:id', tinTucController.sub_comment);
router.put('/like/:id', tinTucController.like);
router.post('/:slug', tinTucController.comment);
router.get('/sub-comment', tinTucController.subcomment);
router.get('/:slug', tinTucController.show);
router.get('/', tinTucController.index);

module.exports = router;
