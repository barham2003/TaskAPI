const express = require("express")
const app = express()
const TaskRoutes = require("./routes/tasksRoutes")
const GroupRoutes = require("./routes/groupRoutes")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


app.use("/tasks", TaskRoutes)
app.use("/groups", GroupRoutes)

module.exports = app