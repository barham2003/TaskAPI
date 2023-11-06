const  mongoose  = require("mongoose");
const Schema = mongoose.Schema
const Model = mongoose.model
const bcrypt = require("bcryptjs")
const crypto = require("crypto")


const userSchema = new Schema({
    name: {
        type:String,
        required: [true,"Name must be provided"]
    },
    password: {
        type: String,
        required:[true,"Password must be provided"],
        select: false
    },
    username:{
    type:String,
    required:[true,"Username must be provided"],
    unique:true
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please Confirm the Password"],
        validate: {
            validator: function(val) {return this.password === val},
            message:"Password and Confirm should be identical to each other!"
        }
    },
    passwordChanged: {type: Date},
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {timestamps:true,toObject:{virtuals:true}, toJSON:{virtuals:true}})


userSchema.virtual("tasks",{
    ref: "Task",
    foreignField:"user",
    localField:"_id"
  })
  

userSchema.pre("save",async function(next) {
    if (!this.isModified('password')) return next();
    const hashPassword =await bcrypt.hash(this.password,9)
    this.password = hashPassword
    this.passwordConfirm = undefined
    next()
})

userSchema.pre("save", function(next) {
    if (!this.isModified('password') || this.isNew) {return next()};
    this.passwordChanged = Date.now() - 1000;
    next();
});


userSchema.methods.correctPassword =async function(canditatePassword, userPassword) {
    return await bcrypt.compare(canditatePassword, userPassword)
}
    
userSchema.methods.isPasswordChanged =  function(JWTTimeStamp) {
    return  new Date(JWTTimeStamp * 1000) < this.passwordChanged
}


userSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.passwordResetExpires = Date.now()+10 * 60 * 1000;

    return resetToken
}
    
const User = Model("User", userSchema)

module.exports = User