const AppError = require("../utils/AppError")



const sendError = (err,res) => {
    // if(!err.isOperational){
    //     res.status(err.statusCode).json({
    //         message: "Something Went Very Wrong!",
    //         status: "error"
    //     })
    //     return
    // }

    res.status(err.statusCode).json({
        message: err.message,
        status: "error",
        code: err.statusCode
    })
}


const handleValidation = (err)=> {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data: ${errors.join(". ")}`
    return new AppError(message, 400)
}

const handleDuplicate = (err) => {
    // const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    // const message = `Duplicate field value: ${value}. Please use another value!`
    const message = "Duplicate group name, please use another value!"
    return new AppError(message,400)
}



module.exports.errorController = (err,req,res,next) => {
    const errName = err.name
    err.statusCode= err.statusCode || 500
    err.status = err.status || "error"
    if(errName==="ValidationError") err=handleValidation(err)
    if(err.code===11000) err = handleDuplicate(err)
    sendError(err,res)
  }


