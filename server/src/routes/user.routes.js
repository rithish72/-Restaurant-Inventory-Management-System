import express from "express";
import {
    userLogin,
    userRegister,
    userLogout,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    deleteUser,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Public Routes
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/refresh-token", refreshAccessToken);

// Protected Routes
router.get("/me", verifyJWT, getCurrentUser);
router.post("/logout", verifyJWT, userLogout);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.put("/update-account", verifyJWT, updateAccountDetails);
router.delete("/delete-account/:id", verifyJWT, deleteUser);

export default router;
