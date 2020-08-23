import React from "react";
import { render } from "react-dom";

import Login from "./components/login";

const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";

let configure_address = "http://0.0.0.0:8004";
if (production) {
  // configure_address = 'http://' + process.env.CONFIGURE_SERVICE_HOST + ':' + process.env.CONFIGURE_SERVICE_PORT
  configure_address = "http://169.51.195.230:30001";
}

render(<Login />, document.getElementById("root"));
