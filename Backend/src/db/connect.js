import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const connect = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDb connected on ${conn.connection.host}`);
    } catch (error) {
        throw  new ApiError(400 , 'Problem in connecting mongoDb' , error) ;
        
        
    }
}
export default connect;