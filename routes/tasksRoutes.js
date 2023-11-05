const express = require("express")
const router = express.Router()
const Task = require("../models/tasksModel")
const mongoose = require("mongoose")
const Group = require("../models/groupsModel")

router.get("/", async (req, res) => {
    try {

        const tasks = await Task.find({}).sort({createdAt: -1}).populate("group")
        res.status(200).json(tasks)
    } catch (e) { res.status(400).json({ message: e.message }) }
})

router.post("/", async (req, res) => {
    try {
        const newTask = await Task.addTask(req.body)
        res.status(200).json(newTask)
    } catch (e) { res.status(400).json({ message: e.message }) }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) { throw Error("NO SUCH TASK!!") }
        const task = await Task.deleteTask(id)
        if (!task) { throw Error("NO SUCH TASK!!!") }
        res.send("Successfully Deleted!!")
    } catch (e) { res.status(400).json({ message: e.message }) }
})


router.patch("/:id/:state", async (req, res) => {
    try {
        const { id, state } = req.params
        const patchTask = await Task.findByIdAndUpdate(id, { state }, { runValidators: true })
        await patchTask.save()
        res.status(200).json("Succesfully Updated!!")
    } catch (e) { res.status(400).json({ message: e.message }) }
})


module.exports = router