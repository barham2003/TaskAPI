const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model

const groupSchema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true, toJSON:{virtuals:true}, toObject:{virtuals:true} })


groupSchema.virtual("tasks",{
    ref:"Task",
    foreignField:"group",
    localField:"_id"
})


groupSchema.pre(/^find/, function(next) {
    this.select("-createdAt -updatedAt -__v")
    next()
})

const Group = Model("Group", groupSchema)
module.exports = Group