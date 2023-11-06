const catchAsync = require("../utils/catchAsync")
const Task = require("../models/tasksModel")
const AppError = require("../utils/AppError")



module.exports.getGroups = catchAsync (async (req, res,next) => {
    const groups = await Task.aggregate([
      {$match:{user:req.user._id}},
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
})


module.exports.deleteGroup = catchAsync(async(req,res,next) =>{
    const {group}= req.params
    const {deletedCount}=await Task.deleteMany({user:req.user._id, group: group})
    if(deletedCount===0) return next(new AppError("No Such Group like that"))
    res.status(201).json({
        state: "Success"
    }) 
})


module.exports.editGroup = catchAsync(async(req,res,next)=> {
    const {group} = req.params
    const {newGroup} = req.body
    const {modifiedCount} = await Task.updateMany({user:req.user._id,group: group},{group:newGroup}, {runValidators:true})
    if(modifiedCount===0) return next(new AppError("No Such Group like that"))
    res.status(201).json({
        message:`${modifiedCount} documents has been changed!`,
        state: "Success"
    })
})