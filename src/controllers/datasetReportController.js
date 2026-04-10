const Dataset = require("../models/Dataset");
const Prediction = require("../models/Prediction");
const DatasetReport = require("../models/datasetReport");
const logActivity = require("../utils/logActivity");

exports.generateDatasetReport = async () => {
    try {

        const datasets = await Dataset.find()
            .populate("uploadedBy", "username");

        const predictions = await Prediction.find()
            .populate("generatedBy", "username");

        for (const ds of datasets) {
            // skip if no user
            if (!ds.uploadedBy) {
                continue;
            }

            const report = predictions.find(
                (p) => p.dataSetId.toString() === ds._id.toString()
            );

            const baseName = ds.originalName.replace(/\.[^/.]+$/, "");

            await DatasetReport.findOneAndUpdate (
                {dataSetId: ds._id}, // Uqniue key
                {
                    dataSetId: ds._id,
                    predictionId: report?._id || null,
                    datasetName: ds.originalName,
                    uploadedBy: ds.uploadedBy._id,
                    predictionResult: report ? `Report-${baseName}` : "-",
                    reportCreatedBy: report?.generatedBy?._id || null,
                },
                {
                    upsert: true, // Create if not exist
                    new: true,
                    setDefaultsOnInsert: true, // Set default value
                }
            )
        }

    } catch (error) {
        console.log(error);
    }
};

exports.getDatasetReports = async (req, res) => {
    try {
        //Call generateDatasetReport
        await exports.generateDatasetReport();

        const reports = await DatasetReport.find({statusReport: "Active"})
            .populate("dataSetId", "originalName")
            .populate("uploadedBy", "username")
            .populate("reportCreatedBy", "username")
            .sort({ createdAt: -1 });

        res.json({
            count: reports.length,
            data: reports,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

exports.updateDatasetReport = async (req, res) => {
    try {
        const datasetReport = await DatasetReport.findById(req.params.id);

        if (!datasetReport) {
            return res.status(404).json({
                message: "Dataset report not found",
            });
        }

        datasetReport.statusReport = "Archived";
        await datasetReport.save();

        await logActivity(
            "UPDATE_DATASET_REPORT",
            `Archived dataset report ${datasetReport.datasetName}`,
            req.user
        );

        res.json({
            message: "Dataset report updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating dataset report",
            error: error.message
        })
    }
}