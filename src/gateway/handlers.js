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

const loginRequest = (email, password) => {
    let url = `${token_address}/auth`

    let requestOptions = {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: "follow",
    };
    return fetch(url, requestOptions);
};

const loginHandler = async (req, res) => {
    let {
        email,
        password
    } = req.body;

    // Invalid form
    if (!email || !password) {
        res.send("Missing email or password");
        return res.status(401).end();
    }

    let accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry
    await loginRequest(email, password).then(response => response.text())
        .then(result => {
            ({
                accessToken,
                refreshToken,
                accessTokenExpiry,
                refreshTokenExpiry
            } = JSON.parse(result))
        })

    //   accessToken can go stale
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
    });
    // refreshToken expires
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenExpiry * 1000,
    });

    res.send({
        accessTokenExpiry,
    });
    res.end();
};

const refreshRequest = (refreshToken) => {
    let url = `${token_address}/refresh`
    let options = {
        method: "POST",
        body: JSON.stringify(refreshToken),
        redirect: "follow",
        headers: {
            'Content-Type': 'application/json'
        },
    }
    return fetch(url, options)

}

const refreshHandler = async (req, res) => {
    let {
        refreshToken
    } = req.cookie

    // No refresh token
    if (!refreshToken) {
        res.send("No Refresh Token")
        return res.status(401).end();
    }

    await refreshRequest(refreshToken)

}

module.exports = {
    loginHandler,
    refreshHandler
};