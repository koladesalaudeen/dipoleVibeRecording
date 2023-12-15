const multer = require("multer");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController").userController;
const deleteUser = require("../controllers/userController").deleteUser;
const updateUser = require("../controllers/userController").updateUser;
const getUserInfo = require("../controllers/userController").getUserInfo;

const pictureStorage = multer.memoryStorage();
const pictureUpload = multer( {storage: pictureStorage});

// Define routes
router.post("/register", userController);
router.patch(
    "/update", 
    pictureUpload.single("profileImage"),
    updateUser);
router.get("/getInfo", getUserInfo)
router.delete("/delete", deleteUser);

module.exports = router;
