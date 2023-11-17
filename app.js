const express = require("express")
const app = express()
const taskRoutes = require("./routes/tasksRoutes")
const groupRoutes = require("./routes/groupsRoutes")
const authRoutes = require("./routes/authRoutes")
const AppError = require("./utils/AppError")
const { errorController } = require("./controller/errorController")
const path = require("path")
const cors = require("cors")

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	next()
})

// ==== Security Packages ====
const helmet = require("helmet")
const xss = require("xss-clean")
const mongoSanatize = require("express-mongo-sanitize")
// const rateLimit = require("express-rate-limit")
// Rate Limiting
// const limiter = rateLimit({
// 	max: 100,
// 	windowMs: 60 * 60 * 1000,
// 	message: "Too many requests from this IP please try again in an hour!",
// })

// Serving static files
app.use(express.static(path.join(__dirname, "public")))

app.use(cors())

// Set Security HTTP headers === SECURITY ===
app.use(helmet())

// Limit Requests form Same IP
// app.use("/", limiter)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
	console.log(req.path, req.method)
	next()
})

// Data Sanitization against NoSQL Query Injection  === SECURITY ===
app.use(mongoSanatize())

// Data Sanitization against XSS   === SECURITY ===
app.use(xss())

app.use("/tasks", taskRoutes)
app.use("/groups", groupRoutes)
app.use("/auth", authRoutes)

app.all("*", (req, res, next) => {
	// res.json({messsage: "ERROR BABA"})
	next(new AppError("Error 404! Not Found", 404))
})

app.use(errorController)

module.exports = app
