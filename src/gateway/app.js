const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const {
    loginHandler,
    refreshHandler
} = require("./handlers");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/login", loginHandler);
app.post("/refresh", refreshHandler)
// app.get("/use", useHandler)

app.listen(8008, "0.0.0.0");