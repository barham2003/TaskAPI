const express = require("express")
const router = express.Router()
const taskRoutes = require("../routes/tasksRoutes")
const groupsControllers = require("../controller/groupsControllers")

const ParamstoQuery = (req,res,next) => { 
    if(req.params?.group) req.query.group = req.params.group 
    next()
}

router.get("/",groupsControllers.getGroups)


router.route("/:group")
.delete(groupsControllers.deleteGroup)
.patch(groupsControllers.editGroup)


router.use("/:group/tasks",ParamstoQuery,taskRoutes)

module.exports = router