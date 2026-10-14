
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"]
    },
    ip: {
        type: String,
        required: [true, "User ip is required"]
    },
    userAgent: {
        type: String
    },
    refreshTokenHash: {
        type: String,
        required: [true, "Refresh token is required"]
    }
}, {
    timestamps: true
});

const sessionModel = mongoose.model("sessions", sessionSchema);

module.exports = sessionModel;
