const Joi = require("joi");
const configData = require("../config/config.js");
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

// const tokenValidation = async (req, res, next) => {
//     try {
//         // console.log(req.headers,"This is request")
//         const tokenBody = req.headers.authorization;

//         if (!tokenBody || !tokenBody.startsWith("Bearer ")) {
//             console.log("Token body")
//             return res.status(401).json({ message: "Tokenbody is not found" });
//         }

//         const token = tokenBody?.split(" ")[1];
//         if (!token) {
//             console.log("Toke")
//             return res.status(401).json({ message: "Token value not found" })
//         };
//         console.log("Upper")
//         console.log("token value : ", token)
//         console.log("JWT SECRET value : ", configData.JWT_ACCESS_SECRET); 

//         let decoded;
 
//         try {
//             decoded = jwt.verify(token, configData.JWT_ACCESS_SECRET);
//             console.log("Token verified successfully:", decoded);
//         } catch (err) {
//             console.error("JWT verification error:", err.name);
//             console.error("JWT verification message:", err.message);

//             return res.status(400).json({
//                 message: "Token verification failed",
//                 error: err.message
//             });
//         }

//         console.log("Lower")
//         console.log("This is the token :", decoded);
//         const user = await registerDataModel.findById(decoded.id)
//         if (!user) {
//             console.log("user")
//             return res.status(400).json({ message: "This token is invalid" })
//         }
//         // const accessToken = jwt.sign({user.data.id},configData.JWT_REFRESH_SECRET,{expiresIn:'7d'});
//         // const refreshToken = jwt.sign({user.data.id},configData.JWT_REFRESH_SECRET,{expiresIn:'7d'});

//         req.user = user;
//         next();
//     }
//     catch (err) {
//         console.error("Middleware error:", err.name, err.message);
//         return res.status(400).json({
//             message: "Invalid or expire token",
//             'err.name': err.name,
//             'err.message': err.message
//         })
//     }
// }

const tokenValidation = async (req, res, next) => {
    try {
        const tokenBody = req.headers.authorization;

        // 1. Authorization header is missing or malformed
        if (!tokenBody || !tokenBody.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token is missing"
            });
        }

        const token = tokenBody.split(" ")[1];

        // 2. Token value is missing
        if (!token) {
            return res.status(401).json({
                message: "Token value is missing"
            });
        }

        let decoded;

        // 3. Verify JWT token
        try {
            decoded = jwt.verify(
                token,
                configData.JWT_ACCESS_SECRET
            );
        } catch (err) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        // 4. Find user in database
        const user = await registerDataModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User associated with token not found"
            });
        }

        // 5. Authentication successful
        req.user = user;
        next();

    } catch (err) {
        // 6. Unexpected server/database error
        console.error("Middleware error:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


module.exports = { registerValidation, loginValidation, tokenValidation };


// MONGODBURL = mongodb+srv://promaticsnitinkumar1_db_user:3qfJyo5KvJwapjbS@cluster0.spinr0e.mongodb.net/auth-learn
// JWT_ACCESS_SECRET = mJiIOUDJF4u9T9iHbN9mke4hyDlEC5ZN7wuITiRUQKt
// JWT_REFRESH_SECRET = 6MazXIpa1LawxJTlFoPF95oEg2gJ6m3laSNNnZYaFHe
// PORT = 5555
// FRONTEND_URL = http://localhost:3000
// NODE_ENV = development
// EMAIL = promatics.nitinkumar1@gmail.com
// PASSWORD = wnzuoiqlpwiksrhm