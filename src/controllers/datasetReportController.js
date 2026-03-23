const Dataset = require("../models/Dataset");
const Prediction = require("../models/Prediction");
const DatasetReport = require("../models/datasetReport");

exports.generateDatasetReport = async (req, res) => {
    try {
        await DatasetReport.deleteMany();

        const datasets = await Dataset.find()
            .populate("uploadedBy", "username");

        const predictions = await Prediction.find()
            .populate("generatedBy", "username");

        const reports = [];

        for (const ds of datasets) {
            const report = predictions.find(
                (p) => p.dataSetId.toString() === ds._id.toString()
            );

            const baseName = ds.originalName.replace(/\.[^/.]+$/, "");

            const newReport = new DatasetReport({
                dataSetId: ds._id,

                predictionId: report?._id || null,

                datasetName: ds.originalName,

                uploadedBy: ds.uploadedBy?._id,

                predictionResult: report
                    ? `Report-${baseName}`
                    : "-",

                reportCreatedBy: report?.generatedBy?._id || null,
            });

            await newReport.save();
            reports.push(newReport);
        }

        res.json({
            message: "DatasetReport generated",
            data: reports,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to generate report",
            error: error.message,
        });
    }
};

exports.getDatasetReports = async (req, res) => {
    try {
        const reports = await DatasetReport.find()
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