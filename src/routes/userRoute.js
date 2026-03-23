const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const {verifyToken,isAdmin} = require('../middleware/authMiddleware')

router.post("/login", userController.login)

router.post("/register", verifyToken, isAdmin, userController.register)

router.get("/users", verifyToken, isAdmin, userController.getUser)

router.put("/user/:id", verifyToken, isAdmin, userController.updateUser)

router.put("/reactivate/:id", verifyToken, isAdmin, userController.reactivateUser)

router.put("/deactivate/:id", verifyToken, isAdmin, userController.deactivateUser)

router.delete("/user/:id", verifyToken, isAdmin, userController.deleteuser)

module.exports = router