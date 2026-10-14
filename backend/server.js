const configData = require("./src/config/config.js")
const app = require("./src/app.js")
const connectWithDb = require("./src/DataBase/mongoDB.js")

connectWithDb();

app.listen(configData.PORT, () => {
    console.log("Server is running on Port :", configData.PORT)
})


// MONGODBURL = mongodb+srv://promaticsnitinkumar1_db_user:3qfJyo5KvJwapjbS@cluster0.spinr0e.mongodb.net/auth-learn
// JWT_SECRET = mJiIOUDJF4u9T9iHbN9mke4hyDlEC5ZN7wuITiRUQKt
// PORT = 5555