const express = require("express");
const router = express.Router();

const { getDatasetReports, updateDatasetReport } = require("../controllers/datasetReportController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getDatasetReports);
router.put("/update/:id", verifyToken, updateDatasetReport);

module.exports = router;