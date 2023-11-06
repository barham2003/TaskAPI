const express = require("express")
const router = express.Router()
const taskRoutes = require("../routes/tasksRoutes")
const groupsControllers = require("../controller/groupsControllers")
const authController = require("../controller/authController")


const ParamstoQuery = (req,res,next) => { 
    if(req.params?.group) req.query.group = req.params.group 
    next()
}

router.get("/",authController.protect,groupsControllers.getGroups)


router.route("/:group")
.delete(authController.protect,groupsControllers.deleteGroup)
.patch(authController.protect,groupsControllers.editGroup)


router.use("/:group/tasks",ParamstoQuery,taskRoutes)

module.exports = router