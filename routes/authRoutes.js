const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")


router.post("/signup",authController.signup)
router.post("/login",authController.login)
router.get("/forgotpassword", authController.forgotPassword)
router.get("/resetpassword/:resetToken" , authController.resetPassword)

router.use(authController.protect)
router.get("/user",authController.getUser)
router.post("/update",authController.updateName)
router.patch("/updatepassword",  authController.changePassword)

module.exports = router