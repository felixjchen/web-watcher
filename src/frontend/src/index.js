import React from "react";
import { render } from "react-dom";

import Login from "./components/login";
import Page from "./components/page";

const gatewayAddress =
  "https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod";

let setCookie = (cname, cvalue, exSeconds) => {
  var d = new Date();
  d.setTime(d.getTime() + exSeconds * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie =
    cname +
    "=" +
    cvalue +
    ";" +
    expires +
    "; domain=" +
    gatewayAddress +
    "; samesite=None; secure";
};

let getCookie = (cname) => {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

let getProfile = async () => {
  // var myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  // myHeaders.append(
  //   "Cookie",
  //   "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbGl4Y2hlbjE5OThAZ21haWwuY29tIiwiaWF0IjoxNTk5OTM2MDQ5LCJleHAiOjE1OTk5MzY5NDl9.x5_O_7wl7u4lh9TY9JhwKs7W5DqVYFbyrSJ9mr3z-2s; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbGl4Y2hlbjE5OThAZ21haWwuY29tIiwiaWF0IjoxNTk5OTM2MDQ5LCJleHAiOjE2MDA1NDA4NDl9.8_zycnH9sOPUinSj9M-LNQ54NFuMkIlBgUBK23lc4YM"
  // );

  var requestOptions = {
    method: "GET",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
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
    setCookie("accessToken", accessToken, accessTokenExpiry);
    setCookie("refreshToken", refreshToken, refreshTokenExpiry);
    render(<Page />, document.getElementById("root"));
    getProfile();
  }
};

render(
  <Login handler={loginButtonClickHandler} />,
  document.getElementById("root")
);
