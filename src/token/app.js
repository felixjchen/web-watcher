const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const {
    authHandler,
    refreshHandler,
    // useHandler
} = require("./handlers");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/auth", authHandler);
app.post("/refresh", refreshHandler)
app.listen(8007, "0.0.0.0");