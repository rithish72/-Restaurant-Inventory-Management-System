import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");

    if (!users || users.length === 0) {
        throw new ApiError(404, "No users found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Fetched all users successfully"));
});

const changeRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!id) {
        throw new ApiError(400, "id not found")
    }

    const user = await User.findByIdAndUpdate(
        id,
        {
            role
        },
        {
            new: true
        }
    )

    if (!user) {
        throw new ApiError(500, "Something went wrong")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Role changed successfully"
            )
        )
})

export {
    getAllUsers,
    changeRole
}