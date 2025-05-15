import { generateStreamToken } from "../db/stream.js";
import asyncHandler from "../utils/asyncHandler.js";
export const StreamToken = async (req, res) => {
    try {
        const token = generateStreamToken(req.user._id);
        
        return res.status(200).json({
            
            token: token
        })
    } catch (error) {
        console.error("Error in generating stream token controller:", error);
        res.status(500).json({
            message: "Error in generating stream token controller",
            error: error.message
        });

    }
}