import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email : {
        type:String,
        required: true,
        unique:true
    },
    password : {
        type: String, 
        required : true,
        minLength: 6
    },
    profilePic :{
        type: String,
        default : "",
    },
    bio :{
        type: String,
        default: ""
    },
    nativeLanguage : {
        type: String , 
        default : ""
    },
    learningLanguage: {
        type : String,
        default : ""
    },
    friends : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default : []
    }],
    isOnBoard: {
        type: Boolean,
        default : false

    }

}, {timestamps : true});

userSchema.pre("save" , async function(next){
    if(!this.isModified("password"))return next()
        try {
            this.password = await bcrypt.hash(this.password , 10);
            next();

        } catch (error) {
            next(error);
            
        }

    
})

userSchema.methods.generateToken = async function(){
    return jwt.sign({
        _id : this._id,
        email:this.email
     },
     process.env.TOKEN_SECRET,
     {
        expiresIn:process.env.TOKEN_EXPIRY
     }
        

    )

}

userSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password , this.password);
}


export const User = mongoose.model("User" , userSchema);