const express = require("express")
const router = express.Router()
const Task = require("../models/tasksModel")
const mongoose = require("mongoose")
const Group = require("../models/groupsModel")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")

router.get("/",catchAsync( async (req, res,next) => {
        const tasks = await Task.find({}).sort({createdAt: -1}).populate({path: "group", select:"name"})
        res.status(200).json(tasks)
}))

const addGroupforTask = async (req,res,next) =>{
    const theGroup = await Group.findOne({ name: req.body.group })
    req.body.group = theGroup?._id
    next()
}

router.post("/", addGroupforTask ,catchAsync(async (req, res,next) => {
        const newTask = await Task.create(req.body)
        res.status(200).json(newTask)
}))

router.get("/:id",catchAsync( async (req, res,next) => {
    const {id} = req.params
    const task = await Task.findById(id).populate("group")
    res.send(task)
}))


router.delete("/:id",catchAsync( async (req, res,next) => {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) return next(new AppError("Invalid ID!!",403))
        const task = await Task.findByIdAndDelete(id)
        if (!task) return next(new AppError("NO SUCH TASK!!",404))
        res.send("Successfully Deleted!!")
}))


router.patch("/:id/:state",catchAsync( async (req, res,next) => {
        const { id, state } = req.params
        const patchTask = await Task.findByIdAndUpdate(id, { state }, { runValidators: true })
        await patchTask.save()
        res.status(200).json("Succesfully Updated!!")
}))


module.exports = router