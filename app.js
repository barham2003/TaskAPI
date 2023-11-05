const express = require("express")
const app = express()
const taskRoutes = require("./routes/tasksRoutes")
const groupRoutes = require("./routes/groupsRoutes")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


app.use("/tasks", taskRoutes)
app.use("/groups", groupRoutes)

module.exports = app