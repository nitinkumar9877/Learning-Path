const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/app.routes");
const configData = require("./config/config.js");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors({ origin: configData.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use(cookieParser());
module.exports = app;