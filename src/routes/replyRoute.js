
const express = require('express');
const router = express.Router();

const createReply = require('../controllers/replyController').createReply;
// reply routes
router.post('/:commentId', createReply);

module.exports = router;