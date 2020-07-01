const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";

// 15 min
const accessTokenExpiry = 900;
// 7 days
const refreshTokenExpiry = 604800;

var configure_address = "http://0.0.0.0:8004";
var { HMAC_KEY } = require("./secrets.json");

if (production) {
  configure_address =
    "http://" +
    process.env.CONFIGURE_SERVICE_HOST +
    ":" +
    process.env.CONFIGURE_SERVICE_PORT;
}

const authDB = async (email, password) => {
  let url =
    configure_address + "/auth?email=" + email + "&password=" + password;

  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  return await fetch(url, requestOptions);
};

const authHandler = async (req, res) => {
  let { email, password } = req.body;

  // Invalid form
  if (!email || !password) {
    res.send("Missing email or password");
    return res.status(401).end();
  }

  // Auth against db
  let resText;

  await authDB(email, password)
    .then((res) => res.text())
    .then((text) => {
      console.log(text);
      resText = text;
    });
  console.log(resText);

  if (resText != "Authenticated") {
    res.send("Incorrect password");
    return res.status(401).end();
  }

  let accessToken = jwt.sign(
    {
      email,
    },
    HMAC_KEY,
    {
      algorithm: "HS256",
      expiresIn: accessTokenExpiry,
    }
  );
  let refreshToken = jwt.sign(
    {
      email,
    },
    HMAC_KEY,
    {
      algorithm: "HS256",
      expiresIn: refreshTokenExpiry,
    }
  );

  // accessToken can go stale
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });
  // refreshToken expires
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiry * 1000,
  });

  res.send({
    accessTokenExpiry,
  });
  res.end();
};

const refreshHandler = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // No refresh token
  if (!refreshToken) {
    return res.status(401).end();
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, HMAC_KEY);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.send("Expired Access Token");
      return res.status(401).end();
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.send("Invalid Refresh Token");
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }

  let { email } = payload;

  let accessToken = jwt.sign(
    {
      email,
    },
    HMAC_KEY,
    {
      algorithm: "HS256",
      expiresIn: accessTokenExpiry,
    }
  );
  let newRefreshToken = jwt.sign(
    {
      email,
    },
    HMAC_KEY,
    {
      algorithm: "HS256",
      expiresIn: refreshTokenExpiry,
    }
  );

  // accessToken can go stale
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });
  // refreshToken expires
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiry * 1000,
  });

  res.send({
    accessTokenExpiry,
  });
  res.end();
};

const useHandler = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).end();
  }

  let payload;
  try {
    payload = jwt.verify(token, HMAC_KEY);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.send("Expired Access Token");
      return res.status(401).end();
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.send("Invalid Access Token");
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }
  res.send(`Welcome ${payload.email}`);
  res.end();
};

module.exports = {
  authHandler,
  refreshHandler,
  useHandler,
};