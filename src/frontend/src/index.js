import React from "react";
import { render } from "react-dom";

import Login from "./components/login";
import Page from "./components/page";

const gatewayAddress = "http://0.0.0.0:8008";

let setCookie = (cname, cvalue, exSeconds) => {
  var d = new Date();
  d.setTime(d.getTime() + exSeconds * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

let loginButtonClickHandler = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  email = "felixchen1998@gmail.com";
  password = "dude";

  let payload = { email, password };
  console.log(payload);
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
  let resopnseText = await response.text();
  let {
    success,
    accessToken,
    accessTokenExpiry,
    refreshTokenExpiry,
    refreshToken,
  } = JSON.parse(resopnseText);

  console.log(
    success,
    accessToken,
    accessTokenExpiry,
    refreshTokenExpiry,
    refreshToken
  );
  if (!success) {
    alert("Bad Login");
  } else {
    setCookie("accesToken", accessToken, accessTokenExpiry);
    setCookie("refreshToken", refreshToken, refreshTokenExpiry);
    render(<Page />, document.getElementById("root"));
  }
};

render(
  <Login handler={loginButtonClickHandler} />,
  document.getElementById("root")
);
