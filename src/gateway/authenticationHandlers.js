const fetch = require("node-fetch");

const { token_address } = require("./globals");

const loginRequest = (email, password) => {
  let url = `${token_address}/authenticate`;
  let options = {
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
  return fetch(url, options);
};
const loginHandler = async (req, res) => {
  let { email, password } = req.body;

  // Invalid form
  if (!email || !password) {
    return res.status(400).json({
      error: "Missing email or password",
      success: false,
    });
  }

  let response = await loginRequest(email, password);
  let tokenResponse = JSON.parse(await response.text());

  // Error
  if (!tokenResponse.success) {
    console.log(`User ${email} failed to authenticate`);
    return res.status(400).json(tokenResponse);
  }
  console.log(`User ${email} authenticated`);

  let {
    accessToken,
    refreshToken,
    refreshTokenExpiry,
    accessTokenExpiry,
  } = tokenResponse;
  res.cookie("accessToken", accessToken, {
    maxAge: accessTokenExpiry * 1000,
    sameSite: "None",
    secure: true,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: refreshTokenExpiry * 1000,
    sameSite: "None",
    secure: true,
  });

  res.send({
    success: true,
    accessTokenExpiry,
  });
  res.end();
};

const refreshRequest = (refreshToken) => {
  let url = `${token_address}/refresh`;

  let options = {
    method: "POST",
    body: JSON.stringify({
      refreshToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  return fetch(url, options);
};
const refreshHandler = async (req, res) => {
  let { refreshToken } = req.cookies;

  // No refresh token
  if (!refreshToken) {
    return res.status(400).json({
      error: "No refresh token",
      success: false,
    });
  }

  let response = await refreshRequest(refreshToken);
  let tokenResponse = JSON.parse(await response.text());

  // Error
  if (!tokenResponse.success) {
    console.log(`Failed refresh`);
    return res.status(400).json(tokenResponse);
  }
  console.log(`User ${tokenResponse.email} refreshed accessToken`);

  // refreshToken not expired, good for new accessToken
  let {
    accessToken,
    newRefreshToken,
    refreshTokenExpiry,
    accessTokenExpiry,
  } = tokenResponse;

  res.cookie("accessToken", accessToken, {
    maxAge: accessTokenExpiry * 1000,
    sameSite: "None",
    secure: true,
  });
  res.cookie("refreshToken", newRefreshToken, {
    maxAge: refreshTokenExpiry * 1000,
    sameSite: "None",
    secure: true,
  });

  res.send({
    success: true,
    accessTokenExpiry,
  });
  res.end();
};

const logoutHandler = async (req, res) => {
  res.cookie("accessToken", "exp", {
    maxAge: 0,
    sameSite: "None",
    secure: true,
  });
  res.cookie("refreshToken", "exp", {
    maxAge: 0,
    sameSite: "None",
    secure: true,
  });

  res.send({
    success: true,
  });
  res.end();
};

module.exports = {
  loginHandler,
  refreshHandler,
  logoutHandler,
};
