const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";
var token_address = "http://0.0.0.0:8007";
var configure_address = "http://0.0.0.0:8004";
var hmac_key;

const getProductionURL = (serviceName) => {
  return (
    "http://" +
    process.env[`${serviceName}_SERVICE_HOST`] +
    ":" +
    process.env[`${serviceName}_SERVICE_PORT`]
  );
};

if (production) {
  token_address = getProductionURL("TOKEN");
  configure_address = getProductionURL("CONFIGURE");
  hmac_key = process.env.HMAC_KEY;
} else {
  ({ hmac_key } = require("./secrets.json"));
}

module.exports = {
  hmac_key,
  token_address,
  configure_address,
};
