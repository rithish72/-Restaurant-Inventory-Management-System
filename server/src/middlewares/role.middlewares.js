import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                403,
                "Forbidden: You don't have permission to perform this action"
            );
        }
        next();
    };
};
