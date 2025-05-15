import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from '../utils/ApiResponse.js';
import { upsertStreamUser } from "../db/stream.js";

export const signUp = asyncHandler(async (req, res, next) => {
    try {
        const { email, password, fullName } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
                error: {
                    missing: [
                        !fullName && "fullName",
                        !email && "email",
                        !password && "password"
                    ].filter(Boolean)
                }
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
                success: false,
                error: "Weak password"
            });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Enter a valid email",
                success: false,
                error: "Invalid email format"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false,
                error: "Duplicate email"
            });
        }

        const index = Math.floor(Math.random() * 100) + 1;
        const RandomAvatar = `https://avatar.iran.liara.run/public/${index}`;

        const user = await User.create({
            email, fullName, password, profilePic: RandomAvatar
        });

        const NewUser = await User.findById(user._id).select("-password");

        await upsertStreamUser({
            id: user._id.toString(),
            name: user.fullName,
            image: user.profilePic || ""
        });

        const token = await user.generateToken();
        res.cookie("jwtToken", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json(new ApiResponse(200, "User Created Successfully", NewUser));
    } catch (error) {
        console.error("Error during sign-up:", error);
        next(error); 
    }
});

export const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
                error: "Missing credentials"
            });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Enter a valid email",
                success: false,
                error: "Invalid email format"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found with this email",
                success: false,
                error: "Email not registered"
            });
        }

        const passwordCheck = await user.checkPassword(password);
        if (!passwordCheck) {
            return res.status(400).json({
                message: "Incorrect Password",
                success: false,
                error: "Wrong password"
            });
        }

        const UserInfo = await User.findById(user._id).select("-password");

        const token = await user.generateToken();
        res.cookie("jwtToken", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json(
            new ApiResponse(200, "Login Successfully", UserInfo)
        );
    } catch (error) {
        console.error("Error in login Function", error);
        return res.status(400).json({
            message: "Error in Logging-in",
            success: false,
            error: error.message
        });
    }
});

export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        new: true
    });

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    res.status(200).clearCookie("jwtToken", option).json(new ApiResponse(200, {}, "Log Out successFully"));
});

export const onBoarding = asyncHandler(async (req, res, next) => {
    try {
        

        const userId = req.user?._id;
        const { fullName, bio, nativeLanguage, learningLanguage } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
                error: {
                    missing: [
                        !fullName && "fullName",
                        !bio && "bio",
                        !nativeLanguage && "nativeLanguage",
                        !learningLanguage && "learningLanguage"
                    ].filter(Boolean)
                }
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { ...req.body, isOnBoard: true },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(400).json({
                message: "User not found",
                success: false,
                error: "Invalid user ID"
            });
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id,
                name: updatedUser.fullName,
                image: updatedUser.profilePic
            });
        } catch (error) {
            console.error("Error in upserting Stream user:", error);
            return res.status(500).json({
                message: "Failed to update Stream user",
                success: false,
                error: error.message
            });
        }

        return res.status(200).json(
            new ApiResponse(200, "User Updated successfully", updatedUser)
        );
    } catch (error) {
        console.error("Error in updating user:", error);
        next(error);
    }
});