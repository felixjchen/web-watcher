const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";
var token_address = "http://0.0.0.0:8007";
var {
    HMAC_KEY
} = require("./secrets.json");

if (production) {
    token_address =
        "http://" +
        process.env.TOKEN_SERVICE_HOST +
        ":" +
        process.env.TOKEN_SERVICE_PORT;
}

const loginRequest = (email, password) => {};

const loginHandler = (req, res) => {
    let {
        email,
        password
    } = req.body;

    // Invalid form
    if (!email || !password) {
        res.send("Missing email or password");
        return res.status(401).end();
    }
};

module.exports = {
    loginHandler,
};