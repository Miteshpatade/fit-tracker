const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
require('./db');

const PORT = process.env.PORT || 8000;  // ✅ Use environment variable if available

// ✅ Configure CORS Properly (Allow Requests from Frontend)
const allowedOrigins = ['http://localhost:3000']; // Add more origins if needed

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // ✅ Allow cookies & authentication headers
}));

// ✅ Middleware Order is Important
app.use(express.json());  // ✅ Ensures JSON requests are parsed correctly
app.use(express.urlencoded({ extended: true })); // ✅ Allows handling form data
app.use(cookieParser());  // ✅ Parse cookies before routes

// ✅ Import Routes
const authRoutes = require('./Routes/Auth');
const calorieIntakeRoutes = require('./Routes/CalorieIntake');
const adminRoutes = require('./Routes/Admin');
const imageUploadRoutes = require('./Routes/imageUploadRoutes');
const sleepTrackRoutes = require('./Routes/SleepTrack');
const stepTrackRoutes = require('./Routes/StepTrack');
const weightTrackRoutes = require('./Routes/WeightTrack');
const waterTrackRoutes = require('./Routes/WaterTrack');
const workoutTrackRoutes = require('./Routes/WorkoutTrack');
const workoutRoutes = require('./Routes/WorkoutPlans');
const reportRoutes = require('./Routes/Report');

// ✅ Use Routes
app.use('/auth', authRoutes);
app.use('/calorieintake', calorieIntakeRoutes);
app.use('/admin', adminRoutes);
app.use('/image-upload', imageUploadRoutes);
app.use('/sleeptrack', sleepTrackRoutes);
app.use('/steptrack', stepTrackRoutes);
app.use('/weighttrack', weightTrackRoutes);
app.use('/watertrack', waterTrackRoutes);
app.use('/workouttrack', workoutTrackRoutes);
app.use('/workoutplans', workoutRoutes);
app.use('/report', reportRoutes);

// ✅ API Test Route
app.get('/', (req, res) => {
    res.json({ message: 'The API is working' });
});

// ✅ Global Error Handling Middleware (Catches Unhandled Errors)
app.use((err, req, res, next) => {
    console.error("🔥 Unhandled Error:", err);
    res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Internal Server Error"
    });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
