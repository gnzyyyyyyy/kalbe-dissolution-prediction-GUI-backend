const mongoose = require("mongoose");
const datasetSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
    },
    rowCount: {
        type: Number
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    uploadTime: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Dataset", datasetSchema);