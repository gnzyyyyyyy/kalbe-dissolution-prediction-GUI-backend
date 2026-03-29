const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const datasetController = require("../controllers/datasetController");
const {verifyToken}= require("../middleware/authMiddleware");

router.post(
    "/upload",
    verifyToken,
    (req, res, next) => {
        upload.single("dataset")(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            next();
        })
    },
    datasetController.uploadDataset
);

router.get("/", verifyToken, datasetController.getDatasets)
router.get("/:id", verifyToken, datasetController.getDatasetById)
router.delete("/:id", verifyToken,datasetController.deleteDataset)

module.exports = router