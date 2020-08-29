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

// var key = fs.readFileSync(__dirname + "/server.key");
// var cert = fs.readFileSync(__dirname + "/server.cert");
// var options = {
//   hostname: "0.0.0.0",
//   key: key,
//   cert: cert,
// };

// https.createServer(options, app).listen(8008, function () {
//   console.log(
//     "Example app listening on port 8008! Go to https://localhost:8008/"
//   );
// });
