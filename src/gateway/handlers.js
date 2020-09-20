const fetch = require("node-fetch");
const {
  verify,
  TokenExpiredError,
  JsonWebTokenError,
} = require("jsonwebtoken");

const { hmac_key, configure_address } = require("./globals");

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
  getUserHandler,
  addUserHandler,
  deleteUserHandler,
  getUserHandler,
  addWatcherHandler,
  deleteWatcherHandler,
};
