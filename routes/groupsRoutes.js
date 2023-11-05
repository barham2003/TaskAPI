const express = require("express")
const router = express.Router()
const Group = require("../models/groupsModel")
const mongoose = require("mongoose")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")

router.get("/",catchAsync (async (req, res,next) => {
        const groups = await Group.find({}).populate("tasks")
        res.status(200).json(groups)
}))


router.post("/",catchAsync(async (req, res,next) => {
        const newGroup = await Group.create(req.body)
        res.send(newGroup)
}))

router.delete("/:name", catchAsync(async (req, res,next) => {
        const { name } = req.params
        // const group = await Group.findOne({name})
        const group =  await Group.findOneAndDelete({name})

        if(!group) {return next (new AppError("Does not exist",402))}
        // if (group?.tasks.length > 0) { return next(new AppError("Please delete Tasks First!", 406)) }

        res.status(200).json(group)
}))



module.exports = router