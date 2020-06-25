const Cloudant = require("@cloudant/cloudant");
const fs = require("fs");

const production = typeof process.env.KUBERNETES_SERVICE_HOST !== "undefined";

let username = "",
    password = "",
    url = ""

if (production) {} else {
    let credentials = JSON.parse(fs.readFileSync("./secrets.json"));
    ({
        username,
        password,
        url
    } = credentials)
}

console.log(username, password, url);
let cloudant = Cloudant({
    username: username,
    password: password,
    url: url
});