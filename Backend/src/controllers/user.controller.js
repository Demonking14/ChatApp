import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const recCommendUser = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized", success: false, error: "No user data" });
        }

        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recCommendUser = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnBoard: true }
            ]
        });

        return res.status(200).json(recCommendUser);
    } catch (error) {
        console.error("Error in recommending user controller:", error);
        res.status(500).json({
            message: "Error in recommending user controller",
            success: false,
            error: error.message
        });
    }
});

export const getFriends = asyncHandler(async (req, res) => {
    try {
        const userFriends = await User.findById(req.user._id).select("friends").populate("friends", "fullName nativeLanguage learningLanguage profilePic")

        return res.status(200).json(userFriends);
    } catch (error) {
        console.error("Error in getFriends user controller:", error);
        res.status(500).json({
            message: "Error in getFriends user controller",
            success: false,
            error: error.message
        });
    }
});

export const sendFriendRequest = asyncHandler(async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const { id: RecipientId } = req.params;

        if (currentUserId == RecipientId) {
            return res.status(400).json({
                message: "You can't send friend request to yourself",
                success: false,
                error: "Invalid operation"
            });
        }

        const recipient = await User.findById(RecipientId);

        if (!recipient) {
            return res.status(400).json({
                message: "Recipient not found",
                success: false,
                error: "Invalid recipient ID"
            });
        }

        if (recipient.friends.includes(currentUserId)) {
            return res.status(400).json({
                message: "You are already friends",
                success: false,
                error: "Already friends"
            });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: currentUserId, recipient: RecipientId },
                { sender: RecipientId, recipient: currentUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Request already exists",
                success: false,
                error: "Duplicate request"
            });
        }

        const friendRequest = await FriendRequest.create({
            sender: currentUserId,
            recipient: RecipientId
        });

        return res.status(200).json(friendRequest);
    } catch (error) {
        console.error("Error in sending Friend request", error);
        return res.status(400).json({
            message: "Error in sending friend request",
            success: false,
            error: error.message
        });
    }
});

export const recieveFriendRequest = asyncHandler(async (req, res) => {
    try {
         if (!req.params.id) {
    return res.status(400).json({ error: 'Missing friend ID in URL' });
  }
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(400).json({
                message: "Friend Request doesn't exist",
                success: false,
                error: "Invalid request ID"
            });
        }

        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this request",
                success: false,
                error: "Unauthorized access"
            });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

      

        return res.status(200).json({message: "Friend Request accepted"})
    } catch (error) {
        console.error("Error in receiving friend request", error);
        return res.status(400).json({
            message: "Error in receiving friend request",
            success: false,
            error: error.message
        });
    }
});

export const incomingRequests = asyncHandler(async (req, res) => {
    const incomingRequest = await FriendRequest.find({
        recipient: req.user._id,
        status: "pending"
    }).populate("sender", "fullName  nativeLanguage  learningLanguage profilePic");

    const acceptedRequest = await FriendRequest.find({
        recipient: req.user._id,
        status: "accepted"
    }).populate("recipient", "fullName profilePic");

    return res.status(200).json({incomingRequest, acceptedRequest})
});

export const ongoingRequests = asyncHandler(async (req, res) => {
    const ongoingRequests = await FriendRequest.find({
        sender: req.user._id,
        status: "pending"
    }).select("recipient")

    return res.status(200).json(ongoingRequests);
});
