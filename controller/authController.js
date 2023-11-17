const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")
const AppError = require("../utils/AppError")
const jwt = require("jsonwebtoken")
const Task = require("../models/tasksModel")
const crypto = require("crypto")

const signToken = id => {
	const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" })
	return token
}

const createSendtoken = (user, statusCode, res) => {
	const cookieOptions = {
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		// secure: true,
	}

	const token = signToken(user.id)
	res.cookie("jwt", token, cookieOptions)
	res.status(statusCode).json({
		user,
		token,
	})
}

module.exports.signup = catchAsync(async (req, res, next) => {
	const { name, password, passwordConfirm, username } = req.body
	const user = await User.create({ name, password, passwordConfirm, username })
	createSendtoken(user, 201, res)
})

module.exports.login = catchAsync(async (req, res, next) => {
	const { username, password } = req.body
	console.log(req.body)
	const user = await User.findOne({ username }).select("+password")
	if (!user) return next(new AppError("Not found this username", 404))
	const checkPassword = await user.correctPassword(password, user.password)
	if (!checkPassword)
		return next(new AppError("Incorrect Email or Password", 402))
	createSendtoken(user, 201, res)
})

module.exports.protect = catchAsync(async (req, res, next) => {
	const token = req.headers?.authorization?.split(" ")[1]
	if (!token) {
		return next(new AppError("You are not authenticated!", 401))
	}
	const { id, iat } = jwt.verify(token, process.env.JWT_SECRET)
	const user = await User.findById(id)
	if (!user) {
		return next(new AppError("The User Doesn't exist anymore!", 401))
	}
	const checkChange = user.isPasswordChanged(iat)
	if (checkChange) return next(new AppError("Password is changed!", 405))
	req.user = user
	next()
})

module.exports.getUser = catchAsync(async (req, res, next) => {
	const { id } = req.user
	const user = await User.findById(id).populate("tasks")
	res.send({ user })
})

module.exports.updateName = async (req, res, next) => {
	const { id } = req.user
	console.log(user)
	const { name } = req.body
	const user = await User.findByIdAndUpdate(
		id,
		{ name },
		{ runValidators: true }
	)
	res.status(201).json({ user })
}

module.exports.changePassword = catchAsync(async (req, res, next) => {
	const { password, passwordConfirm, currentPassword } = req.body
	const user = await User.findById(req.user._id).select("+password")
	const check = await user.correctPassword(currentPassword, user.password)
	if (!check) return next(new AppError("Current password is not right", 401))
	user.password = password
	user.passwordConfirm = passwordConfirm
	await user.save()
	createSendtoken(user, 201, res)
})

module.exports.forgotPassword = async (req, res, next) => {
	const { username } = req.body
	const user = await User.findOne({ username })
	const token = user.createResetToken()
	await user.save({ validateBeforeSave: false })
	console.log(token)
	res.json({ message: "Please read Console log and go resetpassword/token" })
}

module.exports.resetPassword = catchAsync(async (req, res, next) => {
	const { resetToken } = req.params
	const hashedToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	})
	if (!user) {
		return next(new AppError("Token is invalid or has expired!"))
	}
	user.password = req.body.password
	user.passwordConfirm = req.body.passwordConfirm
	user.passwordResetExpires = undefined
	user.passwordResetToken = undefined
	await user.save()
	createSendtoken(user, 201, res)
})
