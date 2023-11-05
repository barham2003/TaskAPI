const mongoose = require("mongoose")
const Group = require("./groupsModel")
const Schema = mongoose.Schema
const Model = mongoose.model

const TasksSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    state: { type: String, required: true, enum: ["todo", "doing", "done"] },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true }
}, { timestamps: true })


TasksSchema.statics.addTask = async function (reqBody) {
    const { title, body, state, group } = reqBody
    if (!title || !body || !state || !group) { throw Error("A field is missing!!") }
    const theGroup = await Group.findOne({ name: group })
    if (!theGroup) { throw Error("There is not a group named that name") }
    const newTask = await new this({ ...reqBody, group: theGroup.id })
    await newTask.save()

    return newTask
}




const Task = Model("Task", TasksSchema)
module.exports = Task