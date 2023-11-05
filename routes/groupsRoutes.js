const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const Task = require("../models/tasksModel")
const taskRoutes = require("../routes/tasksRoutes")
const AppError = require("../utils/AppError")


const ParamstoQuery = (req,res,next) => { 
    if(req.params?.group) req.query.group = req.params.group 
    next()
}

router.get("/",catchAsync (async (req, res,next) => {
        const groups = await Task.aggregate([
            {
              $group: {
                _id: "$group",
                num: {
                  $sum: 1
                }
              }
            }
          ])
        res.status(200).json(groups)
}))


router.route("/:group")
.delete( catchAsync(async(req,res,next) =>{
    const {group}= req.params
    const {deletedCount}=await Task.deleteMany({group})
    if(deletedCount===0) return next(new AppError("No Such Group like that"))
    res.status(201).json({
        state: "Success"
    }) 
}))
.patch(catchAsync(async(req,res,next)=> {
    const {group} = req.params
    const {newGroup} = req.body
    const {modifiedCount} = await Task.updateMany({group},{group:newGroup}, {runValidators:true})
    if(modifiedCount===0) return next(new AppError("No Such Group like that"))
    res.status(201).json({
        message:`${modifiedCount} documents has been changed!`,
        state: "Success"
    })
}))


router.use("/:group/tasks",ParamstoQuery,taskRoutes)

module.exports = router