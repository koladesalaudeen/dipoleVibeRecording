const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController').userController;


// Define routes
router.post('/register', userController);

module.exports = router;
