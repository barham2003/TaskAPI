require("dotenv").config()
const mongoose = require("mongoose");



process.on("uncaughtException", err=> {
    console.log(err.name, err.message)
    process.exit(1)
});
const app = require("./app");
const DB = process.env.DB_URL

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


mongoose.connect(DB)
.then(() => {console.log("Connected to MongoDB")})



const port =3000
const server = app.listen(port, ()=> {
    console.log("Successfully Connected to port", port)
})



process.on("unhandledRejection", err => {
    console.log(err.name, err.message)
    server.close(()=> {
        process.exit(1)
    })})
      