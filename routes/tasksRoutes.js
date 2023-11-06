const express = require("express")
const router = express.Router({mergeParams:true})
const tasksContollers = require("../controller/tasksContollers")
const authController = require("../controller/authController")


router
.route("/")
.get(authController.protect,tasksContollers.getTasks)
.post(authController.protect,tasksContollers.addTask)


router.route("/:id")
.get(authController.protect,tasksContollers.getOneTask)
.delete(authController.protect,tasksContollers.deleteTask)
.patch(authController.protect,tasksContollers.editTask)



module.exports = router