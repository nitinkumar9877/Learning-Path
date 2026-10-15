const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sessionModel = require("../models/session.model.js")
const configData = require("../config/config.js");
const registerDataModel = require("../models/data.model.js");

const app = express();

const registerUser = async (req, res) => {
    const { name, username, email, phonenum, password } = req.body;
    if (!username || !email || !phonenum || !password) {
        return res.status(400).json({
            message: "All field are required"
        });
    };

    const isExistingUser = await registerDataModel.findOne({
        $or: [
            { username },
            { email },
            { phonenum }
        ]
    });
    if (isExistingUser) {
        return res.status(409).json({
            message: "This user is already exists"
        })
    };

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await registerDataModel.create({
        name,
        username,
        email,
        phonenum,
        password: hashedPassword
    });

    const accessToken = jwt.sign({
        id: user._id
    }, configData.JWT_ACCESS_SECRET, {
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign({
        id: user._id
    }, configData.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })

    const hashRefreshToken = await bcrypt.hash(refreshToken, 12);

    const session = await sessionModel.create({
        user: user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        refreshTokenHash: hashRefreshToken
    });

    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,  // it mean it will never access by the js which run in the client side so our cookies data is safe now,
    //     secure: true,   // nobody can asscess the page 
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // })

    const isProduction = configData.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
        path: "/"
    });

    res.status(201).json({
        message: "user Register Successfully",
        user: {
            id: user._id,
            email: email,
            username: username,
            phonenum,
            password: hashedPassword
        }
    });
}

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         if (!email || !password) {
//             return res.status(400).json({
//                 message: "All fields are required"
//             });
//         }

//         // Cleaned up the redundant $or query syntax
//         const user = await registerDataModel.findOne({ email });
//         if (!user) {
//             return res.status(403).json({
//                 message: "The email is wrong please enter the correct details",
//                 success: false
//             });
//         }

//         const isPasswordRight = await bcrypt.compare(password, user.password);
//         if (!isPasswordRight) {
//             return res.status(403).json({
//                 message: "The Password is wrong please enter the correct password",
//                 success: false
//             });
//         }

//         // Generating tokens using your secret configurations
//         const accessToken = jwt.sign(
//             { id: user._id.toString() }, 
//             configData.JWT_ACCESS_SECRET, 
//             { expiresIn: "15m" }
//         );

//         const refreshToken = jwt.sign(
//             { id: user._id.toString() }, 
//             configData.JWT_REFRESH_SECRET, 
//             { expiresIn: "7d" }
//         );

//         // All cookie logic removed to adhere strictly to your header-based auth flow
//         return res.status(200).json({
//             success: true,
//             message: "User logged in successfully",
//             accessToken: accessToken,
//             refreshToken: refreshToken
//         });

//     } catch (err) {
//         console.error("Login Controller Error:", err.message);
//         return res.status(500).json({
//             success: false,
//             message: "An internal server error occurred during login."
//         });
//     }
// };

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "All field are required"
        });
    };

    const user = await registerDataModel.findOne({
        $or: [
            { email }
        ]
    });
    if (!user) {
        return res.status(400).json({
            message: "The email is wrong please enter the correct details",
            success: false
        })
    };

    const isPasswordRight = await bcrypt.compare(password, user.password)
    if (!isPasswordRight) {
        return res.status(401).json({
            message: "The Password is wrong please enter the correct password",
            success: false
        })
    }

    const accessToken = jwt.sign({ // it contain 3 parameters for the generate tokens
        id: user._id  // first take payload which mean on which value of data it will be use for it.
    }, configData.JWT_ACCESS_SECRET, {  //second it require a secret
        expiresIn: "15m" // life duration
    })

    const refreshToken = jwt.sign({
        id: user._id
    }, configData.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })

    // const session = await sessionModel.create({
    //     user: user._id,
    //     ip: req.ip,
    //     userAgent: req.headers["user-agent"],
    //     refreshTokenHash: refreshToken
    // });

    // res.cookie("refreshToken", refreshToken, {
    //     http://localhost:3000/loginhttp://localhost:3000/login: true,  // it mean it will never access by the js which run in the client side so our cookies data is safe now,
    //     secure: true,   // nobody can asscess the page 
    //     sameSite: "None",
    //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    //     path : '/'
    // })

    // res.cookie("accessToken", refreshToken, {
    //     httpOnly: true,  // it mean it will never access by the js which run in the client side so our cookies data is safe now,
    //     secure: true,   // nobody can asscess the page 
    //     sameSite: "None",
    //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    //     path : '/'
    // })


    const isProduction = configData.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
        path: "/"
    });

    res.status(201).json({
        message: "user Login Successfully",
        accessToken: accessToken
    });
}


const getDataFromAccessToken = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "This is our user data fetch from access token",
            userData: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                phonenum: user.phonenum
            }
        })
    }
    catch (err) {
        return res.status(400).json({ message: "Invalid or expire token" })
    }
}


const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        // Step 1: Check whether the cookie exists.
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found. Please log in."
            });
        }

        // Step 2: Verify the refresh token.
        let decoded;

        try {
            decoded = jwt.verify(
                refreshToken,
                configData.JWT_REFRESH_SECRET
            );
        } catch (error) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            });

            return res.status(401).json({
                message: "Refresh token is invalid or expired."
            });
        }

        // Step 3: Generate a new access token.
        const accessToken = jwt.sign(
            { id: decoded.id },
            configData.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        // Step 4: Send the new access token.
        return res.status(200).json({
            message: "Access token generated successfully",
            accessToken
        });

    } catch (error) {
        console.error("Refresh token error:", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


module.exports = { registerUser, loginUser, getDataFromAccessToken, refreshAccessToken};