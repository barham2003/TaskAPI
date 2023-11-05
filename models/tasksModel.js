const mongoose = require("mongoose")
const AppError = require("../utils/AppError")
const Group = require("./groupsModel")
const Schema = mongoose.Schema
const Model = mongoose.model

const taskSchema = new Schema({
    title: { type: String, required: [true,"Title is Required"] },
    body: { type: String, required: [true, "Task Body(text) is required"] },
    state: { type: String, required: [true,"State is Required"], enum: ["todo", "doing", "done"] },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: [true, "Group is not provided or is not available!"] }
}, { timestamps: true })



taskSchema.pre(/^find/, function(next) {
    this.select("-createdAt -updatedAt -__v")
    next()
})

const Task = Model("Task", taskSchema)
module.exports = Task