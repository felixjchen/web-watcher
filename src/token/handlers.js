const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";
var configure_address = "http://0.0.0.0:8004";
var {
	HMAC_KEY
} = require("./secrets.json");

if (production) {
	configure_address =
		"http://" +
		process.env.CONFIGURE_SERVICE_HOST +
		":" +
		process.env.CONFIGURE_SERVICE_PORT;
}

// 15 min
const accessTokenExpiry = 900;
// 7 days
const refreshTokenExpiry = 604800;

const authDB = (email, password) => {
	let url =
		configure_address + "/authenticate";

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

const authHandler = async (req, res) => {
	let {
		email,
		password
	} = req.body;

	// Invalid form
	if (!email || !password) {
		res.send("Missing email or password");
		return res.status(401).end();
	}

	// Auth against db
	let resText;
	await authDB(email, password)
		.then(async response => {
			resText = await response.text()
			resText = JSON.parse(resText)
		})
		.catch(e => {
			console.log(e)
		});

	// Incorrect password
	if (resText.message != "Authenticated") {
		res.send(resText);
		return res.end();
	}

	// Correct password
	let accessToken = jwt.sign({
			email,
		},
		HMAC_KEY, {
			algorithm: "HS256",
			expiresIn: accessTokenExpiry,
		}
	);
	let refreshToken = jwt.sign({
			email,
		},
		HMAC_KEY, {
			algorithm: "HS256",
			expiresIn: refreshTokenExpiry,
		}
	);

	res.send({
		accessToken,
		refreshToken,
		accessTokenExpiry,
	});
	res.end();
};

const refreshHandler = (req, res) => {
	let {
		refreshToken
	} = req.body;

	// No refresh token
	if (!refreshToken) {
		res.send("No Refresh Token");
		return res.status(401).end();
	}

	let payload;
	try {
		payload = jwt.verify(refreshToken, HMAC_KEY);
	} catch (e) {
		if (e instanceof jwt.TokenExpiredError) {
			res.send("Expired Refresh Token");
			return res.status(401).end();
		} else if (e instanceof jwt.JsonWebTokenError) {
			res.send("Invalid Refresh Token");
			return res.status(401).end();
		}
		// otherwise, return a bad request error
		return res.status(400).end();
	}

	let {
		email
	} = payload;

	let accessToken = jwt.sign({
			email,
		},
		HMAC_KEY, {
			algorithm: "HS256",
			expiresIn: accessTokenExpiry,
		}
	);
	let newRefreshToken = jwt.sign({
			email,
		},
		HMAC_KEY, {
			algorithm: "HS256",
			expiresIn: refreshTokenExpiry,
		}
	);

	res.send({
		accessToken,
		newRefreshToken,
		accessTokenExpiry,
	});
	res.end();
};

module.exports = {
	authHandler,
	refreshHandler,
};