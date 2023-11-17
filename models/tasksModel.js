const mongoose = require("mongoose")
const AppError = require("../utils/AppError")
const Schema = mongoose.Schema
const Model = mongoose.model

const taskSchema = new Schema(
	{
		title: { type: String, required: [true, "Title is Required"] },
		body: { type: String, required: [true, "Task Body(text) is required"] },
		state: {
			type: String,
			required: [true, "State is Required"],
			enum: ["todo", "doing", "done"],
		},
		group: { type: String, requried: [true, "Group is required!"] },
		user: { type: Schema.ObjectId, ref: "User" },
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
)

taskSchema.pre(/^find/, function (next) {
	this.select("-updatedAt -__v")
	next()
})

const Task = Model("Task", taskSchema)
module.exports = Task
