"use strict";

import React from "react";
import { Loading } from "carbon-components-react";
import { render } from "react-dom";

import Login from "./components/login";
import Page from "./components/page";

const gatewayAddress =
  "https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod";
let silentRefreshTimeout = null;

let login = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  email = "felixchen1998@gmail.com";
  password = "dude";

  let payload = { email, password };
  let options = {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };

  let response = await fetch(`${gatewayAddress}/login`, options);
  let responseText = await response.text();
  let { success, accessTokenExpiry } = JSON.parse(responseText);

  console.log(responseText);
  if (!success) {
    alert("Bad login");
  } else {
    await getProfile();
    // Start silent refresh a couple seconds early... so we always have an access token
    silentRefreshTimeout = setTimeout(
      silentRefresh,
      (accessTokenExpiry - 2) * 1000
    );
  }
};

let logout = async () => {
  var requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };

  let response = await fetch(`${gatewayAddress}/logout`, requestOptions);
  let responseText = await response.text();
  render(<Login loginHandler={login} />, document.getElementById("root"));

  // Stop silent refresh
  clearTimeout(silentRefreshTimeout);

  return JSON.parse(responseText).success;
};

let getProfile = async () => {
  var requestOptions = {
    credentials: "include",
  };

  let response = await fetch(`${gatewayAddress}/user`, requestOptions);
  let responseText = await response.text();
  console.log(JSON.parse(responseText));
  render(<Page logoutHandler={logout} />, document.getElementById("root"));
};

let silentRefresh = async () => {
  let requestOptions = {
    method: "POST",
    credentials: "include",
  };

  let response = await fetch(`${gatewayAddress}/refresh`, requestOptions);
  let responseText = await response.text();
  let { success, accessTokenExpiry } = JSON.parse(responseText);

  // If something is wrong with refresh token.. we logout
  if (!success) {
    await logout();
  } else {
    // Start silent refresh a couple seconds early... so we always have an access token
    silentRefreshTimeout = setTimeout(
      silentRefresh,
      (accessTokenExpiry - 2) * 1000
    );
  }

  return success;
};

let initialSilentRefresh = async () => {
  try {
    let success = await silentRefresh();

    if (success) {
      await getProfile();
    }
  } catch (err) {
    console.log("Initial silent refresh fail " + err);
  }
};

render(<Loading />, document.getElementById("root"));
initialSilentRefresh();
