const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({

    // Save files in /uploads
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    // Generate unique filename
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
})

// Only allow CSV and XLSX files
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        ".csv", 
        ".xlsx", 
        ".xls"
    ]

    const allowesMimes = [
        "text/csv", 
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        "application/vnd.ms-excel"
    ]

    const ext = path.extname(file.originalname).toLowerCase()

    if(allowedTypes.includes(ext) && allowesMimes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only CSV, XLS and XLSX files are allowed"), false)
    }
}

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

module.exports = upload