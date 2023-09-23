const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const Task = require("./models")
const routes = require("./routes")


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


mongoose.connect('mongodb://127.0.0.1:27017/tasks')
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((e) => {
        console.log("Error from Connecting", e)
    })

app.use("/api/tasks", routes)


const port = 3000
app.listen(port, () => {
    console.log(`Listening from ${port}`)
})