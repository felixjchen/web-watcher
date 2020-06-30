const request = require("request");
const jwt = require("jsonwebtoken");
const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";

const accessTokenExpiry = '3';
const refreshTokenExpiry = '7d'
var configure_address = "http://0.0.0.0:8004";
var {
  HMAC_KEY
} = require("./secrets.json");

if (production) {
  configure_address =
    "http://" +
    process.env.CONFIGURE_SERVICE_HOST +
    ":" +
    process.env.CONFIGURE_SERVICE_PORT;
}

const authRequest = (email, password) => {
  let options = {
    method: "GET",
    url: configure_address + "/auth?email=" + email + "&password=" + password,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) throw new Error(error);
      resolve(body);
    });
  });
};

const auth = async (req, res) => {
  let {
    email,
    password
  } = req.body;
  // Invalid form
  if (!email || !password) {
    res.send("Missing email or password");
    return res.status(401).end();
  }

  // Auth against db
  let r = await authRequest(email, password);
  if (r != "Authenticated") {
    res.send("Incorrect password");
    return res.status(401).end();
  }

  let accessToken = jwt.sign({
    email
  }, HMAC_KEY, {
    algorithm: "HS256",
    expiresIn: accessTokenExpiry,
  })

  let refreshToken = jwt.sign({
    email
  }, HMAC_KEY, {
    algorithm: "HS256",
    expiresIn: refreshTokenExpiry,
  })

  console.log(accessToken, refreshToken);

  res.cookie("refreshToken", accessToken, {
    httpOnly: true
  });
  res.send({
    accessToken,
    accessTokenExpiry,
  });
  res.end();
};

const verify = (req, res) => {
  console.log(req.cookies.token)
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).end();
  }

  var payload;
  try {
    payload = jwt.verify(token, HMAC_KEY);
  } catch (e) {
    console.log(e)
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }
  console.log(payload)
  res.send(`Welcome ${payload.email}`);
};

const refresh = async (req, res) => {};

module.exports = {
  auth,
  verify
};