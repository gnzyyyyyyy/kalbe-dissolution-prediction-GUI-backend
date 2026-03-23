require("dotenv").config({
  path: require("path").resolve(__dirname, ".env"),
  override: true
})

const express = require("express");
const connectDB = require("./src/config/db");

const datasetRoutes = require("./src/routes/datasetRoutes")
const logRoutes = require("./src/routes/logRoutes")
const userRoutes = require("./src/routes/userRoute")
const predictionRoutes = require("./src/routes/predictionRoutes")
const datasetReportRoutes = require("./src/routes/datasetReportRoute")

const User = require("./src/models/User")
const bcrypt = require("bcryptjs")
const cors = require("cors")

const app = express();

async function seedAdmin() {
    const admin = await User.findOne({ role: "administrator" })

    if (!admin) {
        const password = await bcrypt.hash("kalbe123", 10)

        await User.create({
            username: "adminKalbe",
            password: password,
            role: "administrator",
            createdBy: "System"
        })

        console.log("Admin created")
    }
}

app.use(cors())
app.use(express.json())

app.use("/api/datasets", datasetRoutes)
app.use("/api/logs", logRoutes)
app.use("/api/users", userRoutes)
app.use("/api/predictions", predictionRoutes)
app.use("/api/dataset-reports", datasetReportRoutes)

app.get("/", (req, res) => {
    res.send("Kalbe Dissolution Rate API Running...")
})

const PORT = process.env.PORT || 5000

async function startServer() {
    await connectDB()
    await seedAdmin()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer()