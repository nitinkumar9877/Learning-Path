const express = require("express")
const router = express.Router();
const { Router } = require("express");
const { registerUser, loginUser, getDataFromAccessToken, refreshAccessToken, logoutProfile, deleteUserProfile, generateOtp, VerifyOtp, NewPassword } = require("../controllers/auth.controllers.js");
const { registerValidation, loginValidation, tokenValidation } = require("../middelwears/AuthValidation.js");

const authRoutes = Router();
authRoutes.get('/login-page', (req, res) => {
    res.send("This is the demo page for the test");
})

authRoutes.post("/register-user", registerValidation, registerUser);
authRoutes.post("/login-user", loginValidation, loginUser);
authRoutes.get("/profile", tokenValidation, getDataFromAccessToken);
authRoutes.post("/refresh-token", refreshAccessToken);
authRoutes.post("/logout", logoutProfile);
authRoutes.delete("/delete-profile", deleteUserProfile);
authRoutes.post("/generate-otp", generateOtp);
authRoutes.post("/verify-otp", VerifyOtp);
authRoutes.put("/new-password", NewPassword);
// http://localhost:5555/api/auth/verify-otp


// http://localhost:5555/api/auth/refresh-token public API


module.exports = authRoutes;