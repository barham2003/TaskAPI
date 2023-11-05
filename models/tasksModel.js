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
    // Validating Task Body
    const { title, body, state, group } = reqBody
    if (!title || !body || !state || !group) { throw Error("A field is missing!!") }


    // Checking if the Group exists
    const theGroup = await Group.findOne({ name: group })
    if (!theGroup) { throw Error("There is not a group named that name") }

    // Creating Task
    const newTask = await new this({ ...reqBody, group: theGroup.id })
    await newTask.save()

    // Pushing Task into the Group
    theGroup.tasks.unshift(newTask.id)
    await theGroup.save()


    //Returning new Task to response the task that was created
    return newTask
}


TasksSchema.statics.deleteTask = async function (taskid) {
    // Finding the task to delete
    const task = await this.findByIdAndDelete(taskid)

    // Finding the group to pull the task in
    const group = await Group.findByIdAndUpdate(task.group, { $pull: { tasks: taskid } })

    //  Saving the Group after pulling the Task in
    await group.save()

    // Returning the Task but I DONT KNOW WHY I AM DOING THIS!!
    return task
}


const Task = Model("Task", TasksSchema)
module.exports = Task