const express = require('express');
const router = express.Router();

const khamPhaController = require('../app/controllers/KhamPhaController');

router.get('/:slug', khamPhaController.show);
router.get('/', khamPhaController.index);

module.exports = router;
