import express from "express";
import {
    getAllUsers,
    changeRole,
    deleteUserByAdmin,
} from "../controllers/admin.controller.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { User } from "../models/user.models.js";

const router = express.Router();

router.get("/me", verifyJWT, authorizeRoles("Admin"), (req, res) => {
    res.status(200).json({
        success: true,
        role: req.user.role,
    });
});

router.get("/users-details", verifyJWT, getAllUsers);
router.get("/change-role/:id", verifyJWT, changeRole);
router.delete("/delete-user/:id", verifyJWT, deleteUserByAdmin);

export default router;
