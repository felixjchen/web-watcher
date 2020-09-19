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

  fetch(
    "https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod/user",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

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
    // setCookie("accessToken", accessToken, accessTokenExpiry);
    // setCookie("refreshToken", refreshToken, refreshTokenExpiry);
    render(<Page />, document.getElementById("root"));
    getProfile();
  }
};

render(
  <Login handler={loginButtonClickHandler} />,
  document.getElementById("root")
);
