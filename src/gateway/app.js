"use strict";

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
const corsOptions = {
  origin: ["http://localhost:3000", "https://webwatcher.netlify.com"],
  credentials: true,
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));

// email and password set in body, sets accessToken and refreshToken cookies, returns accessTokenExpirey
app.post("/login", loginHandler);
// use refreshToken cookie to fetch a new accessToken
app.post("/refresh", refreshHandler);

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
