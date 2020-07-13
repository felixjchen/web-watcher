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

app.all("/login", loginHandler);
app.get("/refresh", refreshHandler)

app.post("user", addUserHandler)
app.delete("/user", deleteUserHandler)
app.get("/user", getUserHandler)

app.listen(8008, "0.0.0.0");