const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model

const GroupSchema = new Schema({
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
}, { timestamps: true })




const Group = Model("Group", GroupSchema)
module.exports = Group