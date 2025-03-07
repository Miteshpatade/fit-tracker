const express = require('express');
const router = express.Router();
const Admin = require('../Models/AdminSchema'); // Import the Admin model
const bcrypt = require('bcrypt');
const errorHandler = require('../Middlewares/errorMiddleware');
const adminTokenHandler = require('../Middlewares/checkAdminToken');
const jwt = require('jsonwebtoken');

function createResponse(ok, message, data = null) {
    return { ok, message, data };
}

// ✅ Admin Register Route (Signup)
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if the admin with the same email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json(createResponse(false, 'Admin with this email already exists'));
        }

        // ✅ Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword // ✅ Store hashed password
        });

        await newAdmin.save();

        res.status(201).json(createResponse(true, 'Admin registered successfully'));
    } catch (err) {
        next(err);
    }
});

// ✅ Admin Login Route
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json(createResponse(false, 'Invalid admin credentials'));
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json(createResponse(false, 'Invalid admin credentials'));
        }

        // ✅ Generate authentication token
        const adminAuthToken = jwt.sign({ adminId: admin._id }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '10m' });

        // ✅ Store token in cookies securely
        res.cookie('adminAuthToken', adminAuthToken, { 
            httpOnly: true, 
            secure: false, 
            sameSite: "Lax" 
        });

        res.status(200).json(createResponse(true, 'Admin login successful', { adminAuthToken }));
    } catch (err) {
        next(err);
    }
});

// ✅ Check Admin Login Status
router.get('/checklogin', adminTokenHandler, async (req, res) => {
    res.json({
        admin: req.admin, // ✅ Use `req.admin` instead of `req.adminId`
        ok: true,
        message: 'Admin authenticated successfully'
    });
});

// ✅ Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie("adminAuthToken");
    res.status(200).json(createResponse(true, "Admin logged out successfully"));
});

// ✅ Use Error Middleware
router.use(errorHandler);

module.exports = router;
