const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";
var configure_address = "http://0.0.0.0:8004";
var HMAC_KEY;

if (production) {
  configure_address =
    "http://" +
    process.env.CONFIGURE_SERVICE_HOST +
    ":" +
    process.env.CONFIGURE_SERVICE_PORT;
  hmac_key = process.env.HMAC_KEY;
} else {
  var { HMAC_KEY } = require("./secrets.json");
}

// 15 min
const accessTokenExpiry = 900;
// 7 days
const refreshTokenExpiry = 604800;

const authRequest = (email, password) => {
  let url = configure_address + "/authenticate";

  let requestOptions = {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  return fetch(url, requestOptions);
};

const authHandler = async (req, res) => {
  let { email, password } = req.body;

  // Invalid form
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Missing email or password",
    });
  }

  let response = await authRequest(email, password);
  let configureResponse = JSON.parse(await response.text());

  // Incorrect password
  if (configureResponse.message != "Authenticated") {
    return res.status(400).json({
      success: false,
      configureResponse,
    });
  }

  // Correct password
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

  res.send({
    success: true,
    accessToken,
    refreshToken,
    accessTokenExpiry,
  });
  res.end();
};

const refreshHandler = (req, res) => {
  let { refreshToken } = req.body;

  // No refresh token
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: "No Refresh Token",
    });
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, HMAC_KEY);
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(400).json({
        success: false,
        error: "Expired Refresh Token",
      });
    } else if (e instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        success: false,
        error: "Invalid Refresh Token",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Something happend...",
    });
  }

  // refreshToken is legit... sign new refreshToken and accessToken
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

  res.send({
    success: true,
    email,
    accessToken,
    newRefreshToken,
    accessTokenExpiry,
  });
  res.end();
};

module.exports = {
  authHandler,
  refreshHandler,
};
