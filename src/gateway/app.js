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

app.post("/add-user", addUserHandler)
app.delete("/delete-user", deleteUserHandler)
app.post("/login", loginHandler);
app.post("/refresh", refreshHandler)
app.get("/get-user", getUserHandler)

app.listen(8008, "0.0.0.0");