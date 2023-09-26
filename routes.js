const express = require("express")
const router = express.Router()
const Task = require("./models")
const mongoose = require("mongoose")

router.get("/", async (req, res) => {
    try {

        const tasks = await Task.find({})
        res.status(200).json(tasks)
    } catch (e) { res.status(400).json(e.message) }
})

router.post("/", async (req, res) => {
    try {
        const { title, body, state } = req.body
        if (!title || !body || !state) { throw Error("A field is missing!!") }
        const newTask = await new Task(req.body)
        await newTask.save()
        res.status(200).json(newTask)
    } catch (e) { res.status(400).json(e.message) }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) { throw Error("NO SUCH TASK!!") }
        const task = await Task.findByIdAndDelete(id)
        if (!task) { throw Error("NO SUCH TASK!!!") }
        res.send("Successfully Deleted!!")
    } catch (e) { res.status(400).send(e.message) }
})


router.patch("/:id/:state", async (req, res) => {
    try {
        const { id, state } = req.params
        const patchTask = await Task.findByIdAndUpdate(id, { state }, { runValidators: true })
        await patchTask.save()
        res.status(200).json("Succesfully Updated!!")
    } catch (e) { res.status(400).json(e.message) }
})


module.exports = router