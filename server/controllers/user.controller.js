import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "../config/mail.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

// mailer configured in config/mail.js

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "This email is already registered",
                success: false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiresAt: otpExpiry,
            isVerified: false
        });
        // Send OTP email
        await sendOtpEmail({ to: email, otp })
        return res.status(201).json({
            message: "Signup successful. OTP sent to email.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: process.env.NODE_ENV === 'production' ? 'Server error' : error.message,
            success: false
        });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified", success: false });
        }
        if (user.otp !== otp || user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified", success: false });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiresAt = otpExpiry;
        await user.save();
        await sendOtpEmail({ to: email, otp })
        return res.status(200).json({ message: "OTP resent to email", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: "User not verified. Please verify OTP.", success: false });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }
        const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: "1d" });
        const cookieOptions = {
            httpOnly: true,
            secure: env.COOKIE_SECURE,
            sameSite: env.COOKIE_SECURE ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        }
        res.cookie('token', token, cookieOptions)
        return res.status(200).json({
            message: "Login successful",
            user: { name: user.name, email: user.email },
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password -otp -otpExpiry");
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        return res.status(200).json({ user, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect", success: false });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.status(200).json({ message: "Password changed successfully", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token', { path: '/', httpOnly: true, sameSite: env.COOKIE_SECURE ? 'none' : 'lax', secure: env.COOKIE_SECURE })
    return res.status(200).json({ success:true, message:'Logged out' })
}