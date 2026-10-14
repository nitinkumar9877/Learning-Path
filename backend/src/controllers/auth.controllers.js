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
    }, configData.JWT_REFESH_SECRET, {
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
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });
    res.cookie("accessToken", refreshToken, {
        httpOnly: true,
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
        return res.status(403).json({
            message: "The email is wrong please enter the correct details",
            success: false
        })
    };

    const isPasswordRight = await bcrypt.compare(password, user.password)
    if (!isPasswordRight) {
        return res.status(403).json({
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
    }, configData.JWT_REFESH_SECRET, {
        expiresIn: "7d"
    })

    // const session = await sessionModel.create({
    //     user: user._id,
    //     ip: req.ip,
    //     userAgent: req.headers["user-agent"],
    //     refreshTokenHash: refreshToken
    // });

    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,  // it mean it will never access by the js which run in the client side so our cookies data is safe now,
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
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    });
    res.cookie("accessToken", refreshToken, {
        httpOnly: true,
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

module.exports = { registerUser, loginUser, getDataFromAccessToken };