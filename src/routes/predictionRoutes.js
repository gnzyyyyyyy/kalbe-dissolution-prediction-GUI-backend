const express = require ('express')
const router = express.Router()
const predictionController = require('../controllers/predictionController')
const upload = require('../middleware/uploadMiddleware')
const {verifyToken} = require('../middleware/authMiddleware')

router.post("/create", verifyToken, predictionController.createPrediction)

router.post("/predict", verifyToken, upload.single("file"), predictionController.predict)

router.put("/report/:id", verifyToken, upload.single("report"), predictionController.saveReport)

router.get("/export/:id", verifyToken, predictionController.exportPDF)

module.exports = router