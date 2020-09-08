import React from "react";
import { render } from "react-dom";

import Login from "./components/login";

const gatewayAddress =
  "https://8977ea8e.us-south.apigw.appdomain.cloud/gateway";

let loginButtonClickHandler = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

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
  console.log(await response.text());
};

render(
  <Login handler={loginButtonClickHandler} />,
  document.getElementById("root")
);
