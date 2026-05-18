const express = require('express');
const multer = require('multer');
const chatController = require('../controllers/chatController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', upload.single('file'), chatController.handleChat);

module.exports = router;
