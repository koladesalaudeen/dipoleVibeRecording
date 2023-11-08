const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController").userController;
const deleteUser = require("../controllers/userController").deleteUser;

// Define routes
router.post("/register", userController);
router.delete("/delete", deleteUser);

module.exports = router;
