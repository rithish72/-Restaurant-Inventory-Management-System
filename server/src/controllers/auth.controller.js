import nodemailer from "nodemailer";
import { ApiResponse } from "../utils/ApiResponse";

const otpStore = {};

const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
    };
    await transporter.sendMail(mailOptions);
};

const sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOTP();
    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 60 * 1000,
    };

    try {
        await sendOTPEmail(email, otp);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to send OTP",
            error: err.message,
        });
    }
};

const verifyOTP = (req, res) => {
    const { email, otp } = req.body;
    const stored = otpStore[email];

    if (!stored) {
        return res.status(400).json({ message: "No OTP found for this email" });
    }

    if (Date.now() > stored.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ message: "OTP expired" });
    }

    if (stored.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[email];
    res.status(200).json(
        new ApiResponse(200, true, { message: "Email verified successfully", success: "true" })
    );
};

export { sendOTP, verifyOTP };
