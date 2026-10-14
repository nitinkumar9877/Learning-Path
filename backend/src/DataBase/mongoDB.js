const mongoose = require("mongoose");
const configData = require("../config/config");

const connectWithDb = async ()=>{
    await mongoose.connect(configData.MONGODB_URL).then(()=>{
        console.log("The database is connect Successfully");
    }).catch((err)=>{
        console.log("Fail to connect with DataBase",err);
    })
}
module.exports = connectWithDb;