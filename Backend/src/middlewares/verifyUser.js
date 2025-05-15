import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        if (!process.env.TOKEN_SECRET) {
            throw new Error("TOKEN_SECRET is not defined in the environment variables");
        }

        const authHeader = req.header("Authorization");
        const token = req.cookies?.jwtToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
        

        if (!token) {
            throw new ApiError(401, "Authentication token is missing");
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        

        const user = await User.findById(decodedToken._id).select("-password");
      

        if (!user) {
           
            throw new ApiError(404, "User not found. Please log in again.");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            console.error("Invalid token:", error);
            next(new ApiError(401, "Invalid authentication token"));
        } else if (error.name === "TokenExpiredError") {
            console.error("Expired token:", error);
            next(new ApiError(401, "Authentication token has expired"));
        } else {
            console.error("Authentication error:", error);
            next(new ApiError(401, "Authentication error"));
        }
    }
});