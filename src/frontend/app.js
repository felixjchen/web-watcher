const axios = require('axios');
const nunjucks = require('nunjucks')
const express = require('express')
const app = express()

const production = (typeof process.env.KUBERNETES_SERVICE_HOST !== 'undefined');
// console.log(process.env)
var configure_address = 'http://0.0.0.0:8004';
if (production) {
    // configure_address = 'http://' + process.env.CONFIGURE_SERVICE_HOST + ':' + process.env.CONFIGURE_SERVICE_PORT
    configure_address = 'http://184.172.252.145:30000'
}


nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', function (req, res) {

    function getUsers() {
        return axios.get(configure_address + '/users').catch(function(error){
            console.log(error.toJSON());
        });
    }

    function getWatchers() {
        return axios.get(configure_address + '/watchers').catch(function(error){
            console.log(error.toJSON());
        });
    }

    axios.all([getUsers(), getWatchers()]).then(axios.spread(function (users, watchers) {
        // console.log(watchers.data)
        // Convert epoch to date
        for (watcher_id in watchers.data) {
            epoch = watchers.data[watcher_id].last_run
            watchers.data[watcher_id].last_run = new Date(epoch * 1000).toLocaleString("en-US", {timeZone: "America/New_York"})
        }

        res.render('index.html', {
            users: users.data,
            watchers: watchers.data,
            configure_address: configure_address,
        });

    }));

});

app.use(express.static('views'))
app.listen(8005, '0.0.0.0');