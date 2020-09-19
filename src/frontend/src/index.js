"use strict";

import React from "react";
import { render } from "react-dom";

import Login from "./components/login";
import Page from "./components/page";

import { setCookie, getCookie } from "./cookieHelpers";

const gatewayAddress =
  "https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod";

let getProfile = async () => {
  var requestOptions = {
    credentials: "include",
  };

  let response = await fetch(`${gatewayAddress}/user`, requestOptions);
  let responseText = await response.text();

  return JSON.parse(responseText);
};

let getAccessToken = () => {};

let loginButtonClickHandler = async () => {
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
  let {
    success,
    accessToken,
    accessTokenExpiry,
    refreshTokenExpiry,
    refreshToken,
  } = JSON.parse(responseText);

  console.log(responseText);
  if (!success) {
    alert("Bad Login");
  } else {
    setCookie("refreshToken", refreshToken, refreshTokenExpiry);
    let profile = await getProfile();
    console.log(profile);
    render(<Page />, document.getElementById("root"));
  }
};

let refreshToken = getCookie("refreshToken");

if (refreshToken) {
  alert("I have a refresh token...");
}

render(
  <Login handler={loginButtonClickHandler} />,
  document.getElementById("root")
);
