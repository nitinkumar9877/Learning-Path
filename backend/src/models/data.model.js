const mongoose = require("mongoose");
const registerDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is require"]
    },
    username: {
        type: String,
        required: [true, "Username is required for the register"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Username is required for the register"],
        unique: true
    },
    phonenum: {
        type: Number,
        required: [true, "Phone number is required for register"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password must be reuired for the register a user"]
    }
});
const registerDataModel = mongoose.model("user", registerDataSchema);
module.exports = registerDataModel;