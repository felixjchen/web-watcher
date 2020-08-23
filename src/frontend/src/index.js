import React from "react";
import { render } from "react-dom";

import Login from "./components/login";

const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";

let gatewayAddress = "http://0.0.0.0:8008";
if (production) {
  // configure_address = 'http://' + process.env.CONFIGURE_SERVICE_HOST + ':' + process.env.CONFIGURE_SERVICE_PORT
  gatewayAddress = "http://169.51.195.230:30001";
}

let loginButtonClickHandler = () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  console.log(email, password);
};

render(
  <Login handler={loginButtonClickHandler} />,
  document.getElementById("root")
);
