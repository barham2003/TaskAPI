const express = require("express")
const router = express.Router({mergeParams:true})
const tasksContollers = require("../controller/tasksContollers")


router
.route("/")
.get(tasksContollers.getTasks)
.post(tasksContollers.addTask)


router.route("/:id")
.get(tasksContollers.getOneTask)
.delete(tasksContollers.deleteTask)
.patch(tasksContollers.editTask)



module.exports = router