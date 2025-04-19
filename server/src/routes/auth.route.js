import express from "express";
import { sendOTP, verifyOTP } from "../controllers/auth.controller.js";
import { isUserExist, resetPassword } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/user-exist", isUserExist);
router.post("/reset-password", resetPassword)

export default router;
