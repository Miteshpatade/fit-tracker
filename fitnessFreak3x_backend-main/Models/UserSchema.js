const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    weight: [
        {
            weight: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }
    ],
    height: [
        {
            height: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }
    ],
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    goal: {
        type: String,
        required: true,
    },
    calorieIntake: [
        {
            item: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            quantitytype: {
                type: String,
                required: true,
            },
            calorieIntake: {
                type: Number,
                required: true,
            },
        }
    ],
    activityLevel: {
        type: String,
        required: true,
    },
    sleep: [
        {
            date: {
                type: Date,
                required: true,
            },
            durationInHrs: {
                type: Number,
                required: true,
            },
        },
    ],
    steps: [
        {
            date: {
                type: Date,
                required: true,
            },
            steps: {
                type: Number,
                required: true,
            },
        },
    ],
    workouts: [
        {
            date: {
                type: Date,
                required: true,
            },
            exercise: {
                type: String,
                required: true,
            },
            durationInMinutes: {
                type: Number,
                required: true,
            },
        },
    ],
    water: [
        {
            date: {
                type: Date,
                required: true,
            },
            amountInMilliliters: {
                type: Number,
                required: true,
            },
        },
    ],
}, { timestamps: true });

// Pre-save middleware for password hashing
userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it's been modified
    if (user.isModified('password')) {
        console.log("🛑 Raw password before hashing:", user.password);
        user.password = await bcrypt.hash(user.password, 8);
        console.log("✅ Hashed password after hashing:", user.password);
    }

    next();
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
