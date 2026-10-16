const express = require("express")
const router = express.Router();
const { Router } = require("express");
const { registerUser, loginUser, getDataFromAccessToken, refreshAccessToken, logoutProfile } = require("../controllers/auth.controllers.js");
const { registerValidation, loginValidation, tokenValidation } = require("../middelwears/AuthValidation.js");

const authRoutes = Router();
authRoutes.get('/login-page', (req, res) => {
    res.send("This is the demo page for the test");
})

authRoutes.post("/register-user", registerValidation, registerUser)
authRoutes.post("/login-user", loginValidation, loginUser)
authRoutes.get("/profile", tokenValidation, getDataFromAccessToken)
authRoutes.post("/refresh-token", refreshAccessToken);
authRoutes.post("/logout", logoutProfile);


// http://localhost:5555/api/auth/refresh-token public API


module.exports = authRoutes;