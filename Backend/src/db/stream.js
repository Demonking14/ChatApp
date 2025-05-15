import {StreamChat} from 'stream-chat'; 
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY or STREAM_API_SECRET is not defined in the environment variables.");
}


const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData)=>{
    try {
         await serverClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting stream user: " , error);
        
    }
}

export const generateStreamToken = (userId)=>{
    try {
        const UserIdStr = userId.toString();
        return serverClient.createToken(UserIdStr);
    } catch (error) {
        console.error("Error generating stream token: " , error);   
        
    }

}