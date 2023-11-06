const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")


router.get("/user",authController.protect,authController.getUser)
router.post("/signup",authController.signup)
router.post("/login",authController.login)
router.patch("/updatepassword", authController.protect, authController.changePassword)
router.get("/forgotpassword", authController.forgotPassword)
router.get("/resetpassword/:resetToken" , authController.resetPassword)

module.exports = router