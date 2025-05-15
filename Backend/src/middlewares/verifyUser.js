import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        if (!process.env.TOKEN_SECRET) {
            return res.status(500).json({
                success: false,
                message: "TOKEN_SECRET is not defined in the environment variables",
            });
        }

        const authHeader = req.header("Authorization");
        const token = req.cookies?.jwtToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing",
            });
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please log in again.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            console.error("Invalid token:", error);
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
        } else if (error.name === "TokenExpiredError") {
            console.error("Expired token:", error);
            return res.status(401).json({
                success: false,
                message: "Authentication token has expired",
            });
        } else {
            console.error("Authentication error:", error);
            return res.status(401).json({
                success: false,
                message: "Authentication error",
            });
        }
    }
});
