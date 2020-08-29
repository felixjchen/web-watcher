import React from "react";
import { render } from "react-dom";

import Login from "./components/login";

const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";

let gatewayAddress = "http://0.0.0.0:8008";
if (production) {
  // configure_address = 'http://' + process.env.CONFIGURE_SERVICE_HOST + ':' + process.env.CONFIGURE_SERVICE_PORT
  gatewayAddress = "https://8977ea8e.us-south.apigw.appdomain.cloud/gateway";
}

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
