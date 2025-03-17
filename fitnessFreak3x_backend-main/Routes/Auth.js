const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// 🔐 Email Transporter (Use Environment Variables Instead of Hardcoded Credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ API Test Route
router.get('/test', async (req, res) => {
    res.json({
        message: "Auth API is working"
    });
});

// ✅ Helper Function for Consistent JSON Responses
function createResponse(ok, message, data = null) {
    return { ok, message, data };
}

// ✅ REGISTER Route (User Signup)
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, weightInKg, heightInCm, gender, dob, goal, activityLevel } = req.body;

        if (!name || !email || !password || !weightInKg || !heightInCm || !gender || !dob || !goal || !activityLevel) {
            return res.status(400).json(createResponse(false, "All fields are required"));
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json(createResponse(false, "Email already exists"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            weight: [{ weight: weightInKg, unit: "kg", date: Date.now() }],
            height: [{ height: heightInCm, unit: "cm", date: Date.now() }],
            gender,
            dob,
            goal,
            activityLevel
        });

        await newUser.save();
        res.status(201).json(createResponse(true, "User registered successfully"));
    }
    catch (err) {
        next(err);
    }
});

// ✅ LOGIN Route (User Authentication)
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json(createResponse(false, "❌ User not found"));
        }

        // Debugging Logs
        console.log('🔍 Entered password:', password); // Log the entered password
        console.log('🔍 Stored hashed password:', user.password); // Log the stored hashed password

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('🔍 Password comparison result:', isPasswordValid); // Add this log

        if (!isPasswordValid) {
            return res.status(401).json(createResponse(false, "❌ Invalid credentials"));
        }


        // Generate JWT Tokens
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' });

        // Set Tokens in Cookies
        res.cookie("authToken", authToken, { httpOnly: true, secure: false, sameSite: "Lax" });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });

        res.status(200).json(createResponse(true, "✅ Login successful", { authToken, refreshToken }));
    }
    catch (err) {
        next(err);
    }
});

// ✅ CHECK LOGIN Route (Verifies if User is Logged In)
router.post('/checklogin', authTokenHandler, async (req, res) => {
    if (!req.user) {
        return res.status(401).json(createResponse(false, "Authentication failed: No valid token provided"));
    }

    res.json(createResponse(true, "✅ User authenticated successfully"));
});

// ✅ LOGOUT Route (Clears Cookies)
router.post('/logout', (req, res) => {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    res.status(200).json(createResponse(true, "✅ Logged out successfully"));
});

// ✅ SEND OTP Route (For Email Verification)
router.post('/sendotp', async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Log OTP for demo purposes (use secure storage in production)
        console.log(`OTP for ${email}: ${otp}`);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for verification',
            text: `Your OTP is ${otp}`
        };

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.error(err);
                return res.status(500).json(createResponse(false, "❌ Failed to send OTP"));
            } else {
                res.json(createResponse(true, "✅ OTP sent successfully"));
            }
        });
    }
    catch (err) {
        next(err);
    }
});

// ✅ Use Error Handler Middleware
router.use(errorHandler);

module.exports = router;
