import mongoose from 'mongoose';
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum:["Staff", "Manager", "Admin"],
        default: "Staff"
    }
});

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: _id,
        email: email,
        role: role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    })
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: _id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    })
}

export const user = mongoose.model("User", userSchema);
