const mongoose = require("mongoose");

const datasetReportSchema = new mongoose.Schema({
    dataSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dataset",
        required: true,
    },
    predictionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prediction",
        default: null,
    },
    datasetName: String,

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    predictionResult: {
        type: String,
        default: "-",
    },

    reportCreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("DatasetReport", datasetReportSchema);