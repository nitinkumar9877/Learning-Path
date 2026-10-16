const dotenv = require("dotenv");
dotenv.config();

if (!process.env.MONGODBURL) {
    throw new Error("MongoDb is not defined in the environment variable")
}
if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT access Secret is never defined in the environment variable");
}
if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT Refresh Secret is never defined in the environment variable");
}
if (!process.env.PORT) {
    throw new Error("Port is never defined in the environment varibale");
}
if (!process.env.FRONTEND_URL) {
    throw new Error("Frontend url is never defined in the environment varibale");
}
if (!process.env.NODE_ENV) {
    throw new Error("NODE ENV is never defined in the environment varibale");
}
if (!process.env.EMAIL) {
    throw new Error("EMAIL for otp auth is never defined in the environment varibale");
}
if (!process.env.PASSWORD) {
    throw new Error("Password for otp auth is never defined in the environment varibale");
}

const configData = {
    MONGODB_URL: process.env.MONGODBURL,
    PORT: process.env.PORT,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL : process.env.EMAIL,
    PASSWORD : process.env.PASSWORD
}

module.exports = configData;