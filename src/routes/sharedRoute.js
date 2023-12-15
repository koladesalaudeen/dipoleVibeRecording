const express = require("express");
const router = express.Router();
const multer = require("multer");

const { 
    createShared,
    deleteShared,
    updateRecipientsMail,
    searchSharedByColumn,
    searchSharedByDate,
    searchSharedByRecipientsMail,
    getAllShared,
                                 } = require("../controllers/sharedController")

const storage= multer.memoryStorage();
const upload= multer({ storage: storage});

router.post(
    "/upload",
    upload.single("video"),
    createShared
);
router.delete("/:sharedId", deleteShared);
router.patch("/:sharedId/update-recipients", updateRecipientsMail);
router.get("/search-by-column", searchSharedByColumn);
router.get("/search-by-date", searchSharedByDate);
router.get("/search-by-email", searchSharedByRecipientsMail);
router.get('/all', getAllShared);

module.exports = router;
