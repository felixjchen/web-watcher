"use strict";

import React from "react";
import { render } from "react-dom";

import Login from "./components/login";
import Page from "./components/page";

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
    alert("Bad Login");
  } else {
    let profile = await getProfile();
    console.log(profile);
    render(<Page />, document.getElementById("root"));
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

  return JSON.parse(responseText).success;
};

let getAccessToken = async () => {
  let requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };

  let response = await fetch(`${gatewayAddress}/refresh`, requestOptions);
  let responseText = await response.text();
  let { success } = JSON.parse(responseText);

  // If something is wrong with refresh token.. we logout
  if (!success) {
    await logout();
    render(<Login handler={login} />, document.getElementById("root"));
  }

  return success;
};

let initialSilentRefresh = async () => {
  try {
    let success = await getAccessToken();

    if (success) {
      let profile = await getProfile();
      console.log(profile);
      render(<Page />, document.getElementById("root"));
    }
  } catch (err) {
    console.log("Initial silent refresh fail " + err);
  }
};

initialSilentRefresh();
