import React from "react";
import { Loading } from "carbon-components-react";
import { render } from "react-dom";

import Login from "./components/login";
import Page from "./components/page";

const gatewayAddress =
  "https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod";
let silentRefreshTimeout = null;

let login = async ({ email, password }) => {
  if (email == null) {
    email = document.getElementById("email").value;
  }
  if (password == null) {
    password = document.getElementById("password").value;
  }

  console.log(email, password);

  render(<Loading />, document.getElementById("root"));

  let options = {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email, password }),
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
    alert("Login failed: username/password error");
    render(
      <Login signupHandler={signup} loginHandler={login} />,
      document.getElementById("root")
    );
  } else {
    silentRefreshTimeout = setTimeout(
      silentRefresh,
      (accessTokenExpiry - 2) * 1000
    );
    render(
      <Page
        email={email}
        gatewayAddress={gatewayAddress}
        logoutHandler={logout}
      />,
      document.getElementById("root")
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
  render(
    <Login signupHandler={signup} loginHandler={login} />,
    document.getElementById("root")
  );

  // Stop silent refresh
  clearTimeout(silentRefreshTimeout);

  return JSON.parse(responseText).success;
};

let signup = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    alert("You have entered an invalid email address!");
    return true;
  }

  render(<Loading />, document.getElementById("root"));

  let options = {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };

  let response = await fetch(`${gatewayAddress}/user`, options);
  let responseText = await response.text();
  let responseObj = JSON.parse(responseText);

  if (responseObj.success) {
    login({ email, password });
  } else {
    alert("Some error occurred..");
  }
};

let silentRefresh = async () => {
  let requestOptions = {
    method: "POST",
    credentials: "include",
  };

  let response = await fetch(`${gatewayAddress}/refresh`, requestOptions);
  let responseText = await response.text();
  let { success, accessTokenExpiry, email } = JSON.parse(responseText);
  // If something is wrong with refresh token.. we logout
  if (!success) {
    await logout();
  } else {
    // Start silent refresh a couple seconds early... so we always have an access token
    silentRefreshTimeout = setTimeout(
      silentRefresh,
      (accessTokenExpiry - 2) * 1000
    );
    render(
      <Page
        email={email}
        gatewayAddress={gatewayAddress}
        logoutHandler={logout}
      />,
      document.getElementById("root")
    );
  }

  return success;
};

let initialSilentRefresh = async () => {
  try {
    await silentRefresh();
  } catch (err) {
    console.log("Initial silent refresh fail " + err);
  }
};

render(<Loading />, document.getElementById("root"));
initialSilentRefresh();
