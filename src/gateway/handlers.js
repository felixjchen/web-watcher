const fetch = require("node-fetch");
const {
    verify
} = require("jsonwebtoken");

const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";
var token_address = "http://0.0.0.0:8007";
var {
    HMAC_KEY
} = require("./secrets.json");
const {
    response
} = require("express");

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

    let responseText
    await loginRequest(email, password)
        .then(async response => {
            responseText = await response.text()
        }).catch(e => {
            console.log(e)
        })

    // Incorrect password
    if (responseText == "Incorrect password") {
        res.send("Incorrect password")
        return res.end()
    }

    // Correct password
    let {
        accessToken,
        refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry
    } = JSON.parse(responseText)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // maxAge: refreshTokenExpiry * 1000,
    });
    res.send({
        accessToken,
        accessTokenExpiry,
    });
    res.end();
};

const refreshRequest = (refreshToken) => {
    let url = `${token_address}/refresh`

    let options = {
        method: "POST",
        body: JSON.stringify({
            refreshToken
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: "follow",
    };
    return fetch(url, options);

}

const refreshHandler = async (req, res) => {

    // No token at all
    if (!req.cookies) {
        res.send("No Tokens")
        return res.end();
    }

    let {
        refreshToken
    } = req.cookies

    // No refresh token
    if (!refreshToken) {
        res.send("No Refresh Token")
        return res.end();
    }

    let responseText
    await refreshRequest(refreshToken)
        .then(async res => {
            responseText = await res.text()
        }).catch(e => {
            console.log(e)
        })

    // refreshToken expired
    if (responseText == 'Expired Refresh Token') {
        res.send('Expired Refresh Token')
        return res.end();
    }

    // refreshToken not expired, good for new accessToken
    let {
        accessToken,
        newRefreshToken,
        accessTokenExpiry,
        refreshTokenExpiry,
    } = JSON.parse(responseText)

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
    });

    res.send({
        accessToken,
        accessTokenExpiry,
    });
    res.end();
}

const use = (req, res) => {
    let {
        accessToken
    } = req.body


}

module.exports = {
    loginHandler,
    refreshHandler
};