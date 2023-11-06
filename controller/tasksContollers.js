const catchAsync = require("../utils/catchAsync")
const Task = require("../models/tasksModel")
const AppError = require("../utils/AppError")
const  mongoose  = require("mongoose")
const ApiFeatures = require("../utils/ApiFeatures")


module.exports.getTasks = catchAsync(async(req, res,next) => {
    // if(req.params?.group) req.query.group = req.params.group 
    const features =new ApiFeatures(Task.find({user:req.user}) , req.query).filter().sort()
    const tasks = await features.query
    res.status(201).json({data:tasks, status:"success"})
})


module.exports.addTask = catchAsync(async (req, res,next) => {
    const newTask = await Task.create({...req.body,user:req.user})
    res.status(201).json({status: "success", data:newTask})
})


module.exports.getOneTask = catchAsync(async(req, res,next) => {
    const {id} = req.params
    if (!mongoose.isValidObjectId(id)) return next(new AppError("Invalid ID!!",403))
    const task = await Task.findOne({_id: id, user:req.user.id})
    if(!task) return next(new AppError("No task by this ID", 404))
    res.status(201).json({status: "success",data :task})
})


module.exports.deleteTask = catchAsync( async (req, res,next) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return next(new AppError("Invalid ID!!",403))
    const task = await Task.findOneAndDelete({_id:id,user:req.user._id})
    if (!task) return next(new AppError("NO SUCH TASK!!",404))
    res.status(201).json({status:"success", message:"Succesfully Deleted!"})
})



module.exports.editTask = catchAsync(async (req, res,next) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return next(new AppError("Invalid ID!!",403))
    const task = await Task.findOneAndUpdate({_id:id,user:req.user._id}, req.body, { runValidators: true })
    if(!task) return next(new AppError("No Such Task", 404))
    res.status(201).json({status:"success",data: task})
})