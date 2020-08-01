const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const {
    loginHandler,
    refreshHandler,
    getUserHandler,
    addUserHandler,
    deleteUserHandler
} = require("./handlers");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// email and password set in body, sets accessToken and refreshToken cookies, returns accessTokenExpirey
app.all("/login", loginHandler);
// use refreshToken cookie to fetch a new accessToken
app.get("/refresh", refreshHandler)

// Add user
app.post("/user", addUserHandler)
// Need accessToken
app.get("/user", getUserHandler)
// Need accessToken
app.delete("/user", deleteUserHandler)

app.listen(8008, "0.0.0.0");