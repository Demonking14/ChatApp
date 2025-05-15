import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    recipient : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    status: {
        type:String,
        enum:["pending" , "accepted"],
        default:"pending"
    }
} , {timestamps:true});


export const FriendRequest = mongoose.model("FriendRequest" , friendRequestSchema)