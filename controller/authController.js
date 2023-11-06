const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")
const AppError = require("../utils/AppError")
const jwt = require("jsonwebtoken")
const Task = require("../models/tasksModel")
const crypto = require("crypto")

const signToken = (id) => {
    const token =jwt.sign({id},process.env.JWT_SECRET,{expiresIn: "90d"})
    return  token
}

module.exports.signup =catchAsync(async (req,res,next)=> {
    const {name,password,passwordConfirm,username} = req.body
    const user = await User.create({name,password,passwordConfirm,username})
    const token = signToken(user.id)
    res.status(201).json({
        user,
        token
    })
})


module.exports.login = catchAsync(async(req,res,next) => {
    const {username,password} = req.body
    const user = await User.findOne({username}).select("+password")
    const checkPassword =await user.correctPassword(password,user.password)
    if(!checkPassword) return next(new AppError("Incorrect Email or Password",402))
    const token = signToken(user.id)
    res.status(201).json({
        user,
        token
    })
})


module.exports.getUser = catchAsync(async(req,res,next) => {
    const {id} = req.user
    const user =await User.findById(id).populate("tasks")
    res.send({user})
})



module.exports.protect =catchAsync(async(req,res,next)=> {
    const token = req.headers?.authorization?.split(" ")[1]
    if(!token) { return next(new AppError("You are not authenticated!", 401))};
    const {id,iat} = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(id)
    if(!user) {return next(new AppError("The User Doesn't exist anymore!", 401))};
    const checkChange= user.isPasswordChanged(iat)
    if(checkChange) return next(new AppError("Password is changed!",405))
    req.user = user
    next()
})



module.exports.changePassword =catchAsync(async(req,res,next) => {
    const {password ,passwordConfirm, currentPassword }= req.body
    const user = await User.findById(req.user._id).select("+password")
    const check =await user.correctPassword(currentPassword,user.password)
    if(!check) return next(new AppError("Current password is not right", 401))
    user.password = password
    user.passwordConfirm = passwordConfirm
    await user.save();
    const token = signToken(user.id)
    res.json({user,token})
})


module.exports.forgotPassword = async(req,res,next) => {
    const {username} = req.body
    const user = await User.findOne({username})
    const token = user.createResetToken()
    await user.save({validateBeforeSave:false})
    console.log(token)
    res.json({message:"Please read Console log and go resetpassword/token"})
}


module.exports.resetPassword = async(req,res,next) => {
    const {resetToken} = req.params
    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
    const user= await User.findOne({passwordResetToken:hashedToken, passwordResetExpires:{$gt: Date.now()}});
    if(!user){ return next(new AppError("Token is invalid or has expired!"))};
    user.password= req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetExpires=undefined;
    user.passwordResetToken=undefined;
    await user.save();
    const token = signToken(user.id)
    res.json({
        
        user,
        token
    })
}