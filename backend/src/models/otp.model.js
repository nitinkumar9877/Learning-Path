const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "User is required"],
        unique: true
    },
    otp: {
        type: String,
        default: null
    },
    expireAt: {
        type: Date,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

const otpModel = mongoose.model("otp", otpSchema);

module.exports = otpModel;
