const express = require("express");
const router = express.Router();

const { getDatasetReports } = require("../controllers/datasetReportController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, getDatasetReports);

module.exports = router;