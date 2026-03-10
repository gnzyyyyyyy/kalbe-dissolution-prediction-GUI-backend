const express = require("express");
const router = express.Router();
const {isAdmin} = require("../middleware/authMiddleware")

const logController = require("../controllers/logController");

router.get("/", isAdmin, logController.getActivityLogs)

module.exports = router