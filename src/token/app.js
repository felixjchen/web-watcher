const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const {
    auth,
    refresh,
    use

} = require("./handlers");

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/auth", auth);
app.post("/refresh", refresh)
app.get("/use", use)

app.listen(8007, "0.0.0.0");