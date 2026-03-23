const fs = require("fs")
const path = require("path")

const Dataset = require("../models/Dataset");
const DatasetReport = require("../models/datasetReport");
const logActivity = require("../utils/logActivity");

// POST /api/datasets/upload
exports.uploadDataset = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        const dataset = new Dataset({
            fileName: file.filename,
            originalName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            uploadedBy: req.user.id,
        });

        await dataset.save();

        await DatasetReport.create({
            dataSetId: dataset._id,
            datasetName: dataset.originalName,
            uploadedBy: req.user.id,
            predictionResult: "-",
        });

        await logActivity(
            "UPLOAD_DATASET",
            `Uploaded dataset ${dataset.originalName}`,
            req.user
        );

        res.status(201).json({
            message: "File uploaded successfully",
            dataset,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error uploading file",
            error: error.message,
        });
    }
};

// GET /api/datasets
exports.getDatasets = async (req, res) => {
    try{
        const datasets = await Dataset.find().populate("uploadedBy", "username").sort({ uploadTime: -1 })

        res.status(200).json({
            count: datasets.length,
            datasets
        })
    } catch (error) {
        res.status(500).json({
            message: "Error getting datasets",
            error: error.message
        })
    }
}

// GET /api/datasets/:id
exports.getDatasetById = async (req, res) => {
    try{
        const dataset = await Dataset.findById(req.params.id)
        if(!dataset) {
            return res.status(404).json({
                message: "Dataset not found"
            })
        }

        res.status(200).json(dataset)
    } catch (error) {
        res.status(500).json({
            message: "Error getting dataset",
            error: error.message
        })
    }
}

// DELETE /api/datasets/:id
exports.deleteDataset = async (req, res) => {
    try{
        const dataset = await Dataset.findById(req.params.id)
        if(!dataset) {
            return res.status(404).json({
                message: "Dataset not found"
            })
        }

        const filepath = path.join(__dirname, "../..", dataset.filePath)
        if(fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }

        await dataset.deleteOne()

        await logActivity(
            "DELETE_DATASET",
            `Deleted dataset ${dataset.originalName}`,
            req.user
        )
        res.status(200).json({
            message: "Dataset deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting dataset",
            error: error.message
        })
    }
}
