const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sessionModel = require("../models/session.model.js");
const configData = require("../config/config.js");
const registerDataModel = require("../models/data.model.js");
const nodemailer = require("nodemailer");
const otpModel = require("../models/otp.model.js")

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

    // const session = await sessionModel.create({
    //     user: user._id,
    //     ip: req.ip,
    //     userAgent: req.headers["user-agent"],
    //     refreshTokenHash: hashRefreshToken
    // });

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
        console.log("First");

        const refreshTokenBody = req.headers.authorization;
        if (!refreshTokenBody || !refreshTokenBody.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "In URL Header we don't able to find Authorization. Please log in."
            });
        }
        console.log("refreshTokenBody :", refreshTokenBody);
        const refreshToken = refreshTokenBody.split(" ")[1];
        if (!refreshToken) {
            res.status(401).json({
                message: "Refresh Token is Missing"
            })
        }
        console.log("third");

        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                configData.JWT_REFRESH_SECRET
            );
            console.log("4th try");

        } catch (error) {
            console.log("4th catch 1st");

            res.clearCookie("refreshToken", {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            });
            console.log("4th catch 2st");

            return res.status(401).json({
                message: "Refresh token is invalid or expired."
            });
        }
        console.log("5th");

        const accessToken = jwt.sign(
            { id: decoded.id },
            configData.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );
        console.log("6th");

        const newRefreshToken = jwt.sign(
            { id: decoded.id },
            configData.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        )
        console.log("7th");

        const isProduction = configData.NODE_ENV === "production";
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: false,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });
        console.log("8th")
        res.cookie("accessToken", accessToken, {
            httpOnly: false,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
            path: "/"
        });
        console.log("9th");
        console.log("this is the decoded data :", decoded);
        res.status(200).json({
            message: "The user is already Login. We redirect you to the page",
            'New Access Token': accessToken,
            'New Refresh Token': newRefreshToken,
            user: decoded
        })
        console.log("last step for refresh token from backend");
        console.log("Refresh token run successFully");
    } catch (error) {
        console.error("Refresh token error:", error.message);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const logoutProfile = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: false,
            secure: configData.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        })
        res.clearCookie("accessToken", {
            httpOnly: false,
            secure: configData.NODE_ENV === "production",
            sameSite: "lax",
            path: '/'
        })
        res.status(200).json({
            message: "The user logout successfully"
        })
    } catch (error) {
        res.status(400).json({
            message: "Bad req",
            error: error
        })
    }
}

const deleteUserProfile = async (req, res) => {
    try {
        const tokenBody = req?.headers?.authorization;
        // if(!tokenBody || tokenBody.startsWith("Bearer ")){
        //     return res.status(400).json({
        //         message:"Token is not defined in headers"
        //     })
        // }
        if (!tokenBody || !tokenBody.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token is missing"
            });
        }
        console.log("These token body is use for delete the profile :", tokenBody);
        const token = tokenBody?.split(" ")[1];
        console.log("These token is use for delete the profile :", token);
        const decoded = jwt.verify(token, configData.JWT_ACCESS_SECRET);
        console.log(decoded);
        console.log(decoded.id);
        //findByIdAndDelete

        const response = await registerDataModel.findByIdAndDelete(decoded.id);
        if (!response) {
            return res.status(404).json({ message: "The user can't be find" });
        }
        console.log(response);

        const isProduction = configData.NODE_ENV === "production";
        console.log("1");

        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        };
        console.log("2");


        res.clearCookie("accessToken", cookieOptions);
        console.log("3");

        res.clearCookie("refreshToken", cookieOptions);
        console.log("4");
        res.status(200).json({ message: "The user delete his file successfully" });
    } catch (error) {
        console.error("Delete profile error:", error.message);

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Invalid or expired access token",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

const generateOtp = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: configData.EMAIL,
            pass: configData.PASSWORD
        }
    })

    const otpGeneraterMath = () => {
        return Math.floor(100000 + Math.random() * 900000).toString()
    };

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const code = otpGeneraterMath();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000) // 5 min
    await otpModel.deleteMany({ email: email });

    const otpDoc = new otpModel({ email, code, expireAt });
    await otpDoc.save();


    // send to email
    const mailOption = {
        from: configData.EMAIL,
        to: email,
        subject: "This is your otp code",
        text: `ytCommerce Security Alreat. your OTP is ${code}`
    }

    try {
        await transporter.sendMail(mailOption);
        res.json({
            success:true,
            message: "Otp send successfully"
        })

    } catch (err) {
        res.send({
            message: 'otp never send',
            error: err
        })
    }
}

module.exports = { registerUser, loginUser, getDataFromAccessToken, refreshAccessToken, logoutProfile, deleteUserProfile, generateOtp };