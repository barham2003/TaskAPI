const express = require("express")
const app = express()
const taskRoutes = require("./routes/tasksRoutes")
const groupRoutes = require("./routes/groupsRoutes")
const AppError = require("./utils/AppError")
const { errorController } = require("./controller/errorController")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


app.use("/tasks", taskRoutes)
app.use("/groups", groupRoutes)

app.all("*", (req,res, next) => {
    // res.json({messsage: "ERROR BABA"})
    next(new AppError("Error 404! Not Found",404))
})


app.use(errorController)

module.exports = app