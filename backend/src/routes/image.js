const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();
router.get('/', imageController.searchImages);

module.exports = router;
