const fetch = require("node-fetch");

const authDB = (email, password) => {
  let url =
    configure_address + "/auth?email=" + email + "&password=" + password;

  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  return fetch(url, requestOptions);
};
