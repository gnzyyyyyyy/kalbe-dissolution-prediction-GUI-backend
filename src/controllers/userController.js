const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

exports.register = async (req, res) => {
    try {
        const {username, email, password, role} = req.body

        if(!username){
            return res.status(400).json({
                message: 'Username is required'
            })
        }

        //validate email
        if(!validator.isEmail(email)){
            return res.status(400).json({
                message: 'Invalid email'
            })
        }

        if(role === "administrator") {
            const adminCount = await User.countDocuments({role:"administrator"})

            if(adminCount >= 5) {
                return res.status(403).json({
                    message: "Maximum number of administrators reached"
                })
            }
        }

        if(role === "operator") {
            const operatorCount = await User.countDocuments({role:"operator"})

            if(operatorCount >= 15) {
                return res.status(403).json({
                    message: "Maximum number of operators reached"
                })
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        res.json({
            message: 'User created successfully',
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body

        const user = await User.findOne({username})

        if(!user){
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const valid = await bcrypt.compare(password, user.password)

        if(!valid){
            return res.status(401).json({
                message: 'Invalid password'
            })
        }

        const token = jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        )
        res.json({
            message: 'Login successful',
            token: token
        })
    } catch (error) {
        console.log(error)

        res.status(500).json(error)
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.find().select("-password")

        res.json(user)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

exports.updateUser = async (req, res) => {
    try {
        const {id} = req.params
        const {username, email, role} = req.body

        if(role === "administrator") {
            const adminCount = await User.countDocuments({role:"administrator"})

            if(adminCount >= 5) {
                return res.status(403).json({
                    message: "Maximum number of administrators reached"
                })
            }
        }

        if(role === "operator") {
            const operatorCount = await User.countDocuments({role:"operator"})

            if(operatorCount >= 15) {
                return res.status(403).json({
                    message: "Maximum number of operators reached"
                })
            }
        }

        const user = await User.findByIdAndUpdate(
            id,
            {username, email, role},
            {new: true}
        )

        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

exports.deleteuser = async (req, res) => {
    try {
        const {id} = req.params

        const user = await User.findByIdAndDelete(id)

        res.json({
            message: 'User deleted successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}