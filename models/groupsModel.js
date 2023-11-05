const mongoose = require("mongoose")
const AppError = require("../utils/AppError")
const Task = require("./tasksModel")
const Schema = mongoose.Schema
const Model = mongoose.model

const groupSchema = new Schema({
    name: { type: String, required: true,unique:true },
}, { timestamps: true, toJSON:{virtuals:true}, toObject:{virtuals:true} })


groupSchema.virtual("tasks",{
    ref:"Task",
    foreignField:"group",
    localField:"_id"
})


groupSchema.pre(/^find/,async function(next) {
    this.select("-createdAt -updatedAt -__v")
    console.log(this)
    // const task =await Task.find({group: this._id})
    // console.log(task)
    next()
})

groupSchema.pre("findOneAndDelete",async function(next) {
    console.log(console.log(this))
    await Task.deleteMany({group: this._id})
    if (this.tasks?.length > 0) { return next(new AppError("Please delete Tasks First!", 406)) }
    next()
})

const Group = Model("Group", groupSchema)
module.exports = Group