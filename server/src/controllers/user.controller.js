import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save(
            {validateBeforeSave: false}
        );

        return { 
            accessToken, 
            refreshToken 
        };
    } catch (error) {
        throw new ApiError(
            500, 
            "Something went wrong while generating token"
        );
    }
};

const userRegister = asyncHandler(async (req, res) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();
    const role = req.body.role?.trim();

    if (!name || !email || !password || !role) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne(
        { email }
    );

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const user = await User.create(
        { 
            name, 
            email, 
            password, 
            role 
        }
    );

    const createUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                createUser, 
                "User registered successfully"
            )
        );
});

const userLogin = asyncHandler(async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                { 
                    user: loggedInUser, 
                    accessToken, 
                    refreshToken 
                }, 
                "User logged in successfully"
            )
        );
});

const userLogout = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized request");
    }

    await User.findByIdAndUpdate(
        req.user._id, 
        { 
            $unset: 
            { 
                refreshToken: "" 
            } 
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "User logged out"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user || incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    { 
                        accessToken, 
                        refreshToken: newRefreshToken 
                    }, 
                    "Access token refreshed"
                )
            );
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(
                401, 
                "Refresh token expired. Please log in again."
            );
        }
        throw new ApiError(
            401, 
            error?.message || "Invalid refresh token"
        );
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required");
    }

    const user = await User.findById(req.user?._id);
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "Password changed successfully"
            )
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                req.user, 
                "Current user fetched successfully"
            )
        );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email) {
        throw new ApiError(400, "Name and email are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { 
            $set: { 
                name, 
                email 
            } 
        },
        { 
            new: true 
        }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                user, 
                "Account details updated successfully"
            )
        );
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");

    if (!users || users.length === 0) {
        throw new ApiError(404, "No users found");
    }

    return res
        .status(200)
        .json(
            new 
            ApiResponse(
                200, 
                users, 
                "Fetched all users successfully"
            )
        );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid or missing user ID");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        throw new ApiError(404, "User not found or already deleted");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {}, 
                "User deleted successfully"
            )
        );
});

export {
    userLogin,
    userRegister,
    userLogout,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getAllUsers,
    deleteUser
};
