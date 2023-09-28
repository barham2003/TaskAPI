const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const Task = require("./TasksModel")
const TaskRoutes = require("./TasksRoutes")
const GroupRoutes = require("./GroupRoutes")


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET POST PUT DELETE');

    next();
});

mongoose.connect('mongodb://127.0.0.1:27017/tasks')
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((e) => {
        console.log("Error from Connecting", e)
    })

app.use("/tasks", TaskRoutes)
app.use("/groups", GroupRoutes)


const port = 3000
app.listen(port, () => {
    console.log(`Listening from ${port}`)
})