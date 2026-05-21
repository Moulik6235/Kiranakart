import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    phone:{type:String, unique:true, sparse:true},
    otpCode:{type:String},
    otpExpiry:{type:Date},
    cartItems:{type:Object, default:{}},
}, {minimize:false})

const User = mongoose.models.User || mongoose.model('user', userSchema)

export default User;