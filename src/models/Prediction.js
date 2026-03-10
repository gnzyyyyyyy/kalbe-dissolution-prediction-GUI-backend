const mongoose = require('mongoose')

const predictionSchema = new mongoose.Schema({
    reportFileName: {
        type: String,
        required: true
    },
    dataSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dataset',
        required: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportFilePath: {
        type: String
    },
    reportFileSize: {
        type: Number
    },
    predictedProfile: {
        type: Array
    }
})

module.exports = mongoose.model("Prediction", predictionSchema)