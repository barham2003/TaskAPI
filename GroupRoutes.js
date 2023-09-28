const express = require("express")
const router = express.Router()
const Group = require("./GroupsModel")
const mongoose = require("mongoose")

router.get("/", async (req, res) => {
    try {
        const groups = await Group.find({}).populate("tasks")
        res.status(200).json(groups)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }

})


router.post("/", async (req, res) => {
    try {
        const {name} = req.body
        if(!name) {
            throw Error("Name is Required!!")
        }
        const match = await Group.find({name})
        if(match.length > 0) {throw Error("The name is Duplicate!!")}
        const newGroup = new Group(req.body)
        await newGroup.save()
        res.send(newGroup)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) { throw Error("NO SUCH GROUP!!") }
        const group = await Group.findById(id)
        if (group.tasks.length > 0) { throw Error("First Delete Tasks!!!") }
        await Group.findByIdAndDelete(id)
        res.status(400).json(group)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})



module.exports = router