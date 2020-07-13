const fetch = require("node-fetch");
const {
    verify,
    TokenExpiredError,
    JsonWebTokenError,
} = require("jsonwebtoken");

const {
    hmac_key,
    token_address,
    configure_address
} = require('./globals');


const loginRequest = (email, password) => {
    let url = `${token_address}/auth`
    let options = {
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
    return fetch(url, options);
};

const loginHandler = async (req, res) => {
    let {
        email,
        password
    } = req.body;

    // Invalid form
    if (!email || !password) {
        res.send("Missing email or password");
        return res.end();
    }

    let responseText
    await loginRequest(email, password)
        .then(async response => {
            responseText = await response.text()
        }).catch(e => {
            console.log(e)
        })

    // Incorrect password
    console.log(responseText)
    if (responseText != "Authenticated") {
        res.send(responseText)
        return res.end()
    }

    // Correct password
    let {
        accessToken,
        refreshToken,
        accessTokenExpiry
    } = JSON.parse(responseText)


    let payload;
    try {
        payload = verify(accessToken, hmac_key);
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            res.send("Expired Access Token");
            return res.status(401).end();
        } else if (e instanceof JsonWebTokenError) {
            res.send("Invalid Access Token");
            return res.status(401).end();
        }
        // otherwise, return a bad request error
        console.log(e)
        return res.status(400).end();
    }
    console.log(payload)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
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
    } = JSON.parse(responseText)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
    });
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
    });

    res.send({
        accessTokenExpiry,
    });
    res.end();
}


const getUserRequest = (email) => {
    let url = `${configure_address}/users/${email}`
    let options = {
        method: "GET",
        redirect: "follow",
    }
    return fetch(url, options)
}
const getUserHandler = async (req, res) => {

    // No token at all
    if (!req.cookies) {
        res.send("No Tokens")
        return res.end();
    }

    let {
        accessToken
    } = req.cookies

    // No refresh token
    if (!accessToken) {
        res.send("No Access Token")
        return res.end();
    }

    let payload;
    try {
        payload = verify(accessToken, hmac_key);
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            res.send("Expired Access Token");
            return res.status(401).end();
        } else if (e instanceof JsonWebTokenError) {
            res.send("Invalid Access Token");
            return res.status(401).end();
        }
        // otherwise, return a bad request error
        console.log(e)
        return res.status(400).end();
    }

    console.log(payload)

    let responseText
    await getUserRequest(payload.email).then(
        async response => {
            responseText = await response.text()
        }).catch(e => {
        console.log(e)
    })

    responseText = JSON.parse(responseText)

    console.log(responseText)

    res.send("Welcome " + JSON.stringify(payload))
    res.end()
}

const addUserRequest = (email, password) => {
    let url = `${configure_address}/users`
    let options = {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: "follow",
    }

    return fetch(url, options)
}

const addUserHandler = async (req, res) => {
    let {
        email,
        password
    } = req.body;

    // Invalid form
    if (!email || !password) {
        res.send("Missing email or password");
        return res.end();
    }

    let responseText
    await addUserRequest(email, password).then(async res => {
        responseText = await res.text()
    })

    res.send(responseText)
    res.end()
}


const deleteUserRequest = (email) => {
    let url = `${configure_address}/users/${email}`
    let options = {
        method: "DELETE",
        redirect: "follow",
    }
    return fetch(url, options)
}
const deleteUserHandler = async (req, res) => {
    let {
        email
    } = req.body

    if (!email) {
        res.send("Missing email")
        return res.end()
    }

    let responseText
    await deleteUserRequest(email).then(async res => {
        responseText = await res.text()
    })

    res.send(responseText)
    res.end()
}

module.exports = {
    loginHandler,
    refreshHandler,
    getUserHandler,
    addUserHandler,
    deleteUserHandler,
    getUserHandler,
};