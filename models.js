const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model

const TasksSchema = Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    state: { type: String, required: true, enum: ["todo", "doing", "done"] }
}, { timestamps: true })

const Task = Model("Task", TasksSchema)

module.exports = Task