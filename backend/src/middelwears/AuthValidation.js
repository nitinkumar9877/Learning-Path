const Joi = require("joi");
const config = require("../config/config.js");
const registerDataModel = require("../models/data.model.js");
const jwt = require("jsonwebtoken");

const registerValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),

        // Phone number should contain exactly 10 digits
        phonenum: Joi.string().pattern(/^[0-9]{10}$/).required(),

        username: Joi.string().min(3).max(100).required(),
        password: Joi.string().required()
        // password: Joi.string().min(8).max(100).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad request",
            error: error.details[0].message
        });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad request",
            error: error.details[0].message
        });
    }
    next();
};

const tokenValidation = async (req, res, next) => {
    try {
        // console.log(req.headers,"This is request")
        const tokenBody = req.headers.authorization;

        if (!tokenBody || !tokenBody.startsWith("Bearer ")) {
            console.log("Token body")
            return res.status(401).json({ message: "Tokenbody is not found" });
        }
        
        const token = tokenBody?.split(" ")[1];
        if (!token) {
            console.log("Toke")
            return res.status(401).json({ message: "Token value not found" })
        };
        console.log("Upper")
        console.log("token value : ", token)
        console.log("JWT SECRET value : ",config.JWT_ACCESS_SECRET ); // the code is crashing for these point please chatgpt solve this
        const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
        console.log("Lower")

        console.log("This is the token :", decoded);
        const user = await registerDataModel.findById(decoded.id)
        if (!user) {
            console.log("user")

            return res.status(401).json({ message: "This token is invalid" })
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(400).json({ message: "Invalid or expire token" })
    }
}

module.exports = { registerValidation, loginValidation, tokenValidation };