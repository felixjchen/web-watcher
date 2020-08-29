const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const {
  loginHandler,
  refreshHandler,
  getUserHandler,
  addUserHandler,
  deleteUserHandler,
  addWatcherHandler,
  deleteWatcherHandler,
} = require("./handlers");

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// email and password set in body, sets accessToken and refreshToken cookies, returns accessTokenExpirey
app.all("/login", loginHandler);
// use refreshToken cookie to fetch a new accessToken
app.all("/refresh", refreshHandler);

// Add user
app.post("/user", addUserHandler);

// Need accessToken
app.get("/user", getUserHandler);
app.delete("/user", deleteUserHandler);

// Need accessToken
app.post("/watcher", addWatcherHandler);
app.delete("/watcher", deleteWatcherHandler);

app.listen(8008, "0.0.0.0");
console.log("Gateway service listening on 8008");
