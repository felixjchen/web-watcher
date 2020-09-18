const fetch = require("node-fetch");
const {
  verify,
  TokenExpiredError,
  JsonWebTokenError,
} = require("jsonwebtoken");

const { hmac_key, token_address, configure_address } = require("./globals");

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
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  console.log(res);
  res
    .send({
      success: true,
      accessToken,
      accessTokenExpiry,
      refreshToken,
      refreshTokenExpiry,
    })
    .end();
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

  // res.cookie("accessToken", accessToken, {
  //   httpOnly: true,
  // });
  // res.cookie("refreshToken", newRefreshToken, {
  //   httpOnly: true,
  // });

  res
    .send({
      success: true,
      accessToken,
      accessTokenExpiry,
      newRefreshToken,
      refreshTokenExpiry,
    })
    .end();
};

const addUserRequest = (email, password) => {
  let url = `${configure_address}/users`;
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
const addUserHandler = async (req, res) => {
  let { email, password } = req.body;

  // Invalid form
  if (!email || !password) {
    res.send("Missing email or password");
    return res.end();
  }

  let response = await addUserRequest(email, password);
  let responseText = JSON.parse(await response.text());

  res.send(responseText);
  res.end();
};

const getUserRequest = (email) => {
  let url = `${configure_address}/users/${email}`;
  let options = {
    method: "GET",
    redirect: "follow",
  };
  return fetch(url, options);
};
const getUserHandler = async (req, res) => {
  let { accessToken } = req.cookies;

  // No access token
  if (!accessToken) {
    return res.status(400).json({
      error: "No access token",
      success: false,
    });
  }

  let payload;
  try {
    payload = verify(accessToken, hmac_key);
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return res.status(400).json({
        error: "Expired access token",
        success: false,
      });
    } else if (e instanceof JsonWebTokenError) {
      return res.status(403).json({
        error: "Invalid access token",
        success: false,
      });
    }
    // otherwise, return a bad request error
    return res.status(500).json({
      error: "Token error",
      success: false,
    });
  }

  let response = await getUserRequest(payload.email);
  let responseObj = JSON.parse(await response.text());
  console.log(`Get ${payload.email} success`);
  responseObj.success = true;
  res.send({
    ...responseObj,
    ...payload,
  });
  res.end();
};

const deleteUserRequest = (email) => {
  let url = `${configure_address}/users/${email}`;
  let options = {
    method: "DELETE",
    redirect: "follow",
  };
  return fetch(url, options);
};
const deleteUserHandler = async (req, res) => {
  let { accessToken } = req.cookies;

  // No access token
  if (!accessToken) {
    return res.status(400).json({
      error: "No access token",
      success: false,
    });
  }

  let payload;
  try {
    payload = verify(accessToken, hmac_key);
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return res.status(400).json({
        error: "Expired access token",
        success: false,
      });
    } else if (e instanceof JsonWebTokenError) {
      return res.status(403).json({
        error: "Invalid access token",
        success: false,
      });
    }
    // otherwise, return a bad request error
    return res.status(500).json({
      error: "Token error",
      success: false,
    });
  }

  let response = await deleteUserRequest(payload.email);
  let responseObj = JSON.parse(await response.text());

  console.log(responseObj);
  res.send(responseObj);
  res.end();
};

const addWatcherRequest = (email, url, frequency) => {
  let requestURL = `${configure_address}/watchers`;
  let options = {
    method: "POST",
    body: JSON.stringify({
      email,
      url,
      frequency,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  return fetch(requestURL, options);
};
const addWatcherHandler = async (req, res) => {
  let { url, frequency } = req.body;

  // Invalid form
  if (!url || !frequency) {
    return res.status(400).json({
      error: "Missing email, url or password",
      success: false,
    });
  }

  let { accessToken } = req.cookies;

  // No access token
  if (!accessToken) {
    return res.status(400).json({
      error: "No access token",
      success: false,
    });
  }

  // Auth
  let payload;
  try {
    payload = verify(accessToken, hmac_key);
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return res.status(400).json({
        error: "Expired access token",
        success: false,
      });
    } else if (e instanceof JsonWebTokenError) {
      return res.status(403).json({
        error: "Invalid access token",
        success: false,
      });
    }
    // otherwise, return a bad request error
    return res.status(500).json({
      error: "Token error",
      success: false,
    });
  }

  let { email } = payload;
  let response = await addWatcherRequest(email, url, frequency);
  let responseObj = JSON.parse(await response.text());
  responseObj.success = true;

  console.log(`${email} add watcher for ${url} with frequency ${frequency}`);

  res.send(responseObj);
  res.end();
};

const deleteWatcherRequest = (watcherId) => {
  let url = `${configure_address}/watchers/${watcherId}`;
  let options = {
    method: "DELETE",
    redirect: "follow",
  };
  return fetch(url, options);
};
const deleteWatcherHandler = async (req, res) => {
  let { watcherId } = req.body;

  // Invalid form
  if (!watcherId) {
    return res.status(400).json({
      error: "Missing watcherId",
      success: false,
    });
  }

  let { accessToken } = req.cookies;

  // No access token
  if (!accessToken) {
    return res.status(400).json({
      error: "No access token",
      success: false,
    });
  }

  // Auth
  let payload;
  try {
    payload = verify(accessToken, hmac_key);
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return res.status(400).json({
        error: "Expired access token",
        success: false,
      });
    } else if (e instanceof JsonWebTokenError) {
      return res.status(403).json({
        error: "Invalid access token",
        success: false,
      });
    }
    // otherwise, return a bad request error
    return res.status(500).json({
      error: "Token error",
      success: false,
    });
  }

  let { email } = payload;
  let response = await deleteWatcherRequest(watcherId);
  let responseObj = JSON.parse(await response.text());
  responseObj.success = true;

  console.log(`${email} deleted watcher ${watcherId}`);

  res.send(responseObj);
  res.end();
};

module.exports = {
  loginHandler,
  refreshHandler,
  getUserHandler,
  addUserHandler,
  deleteUserHandler,
  getUserHandler,
  addWatcherHandler,
  deleteWatcherHandler,
};
