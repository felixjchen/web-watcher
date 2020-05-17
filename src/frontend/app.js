const axios = require('axios');
const nunjucks = require('nunjucks')
const express = require('express')
const app = express()

const production = (typeof process.env.KUBERNETES_SERVICE_HOST !== 'undefined');
console.log(process.env)
var configure_adddress = 'http://0.0.0.0:8004';
if (production) {
    // configure_adddress = 'http://' + process.env.CONFIGURE_SERVICE_HOST + ':' + process.env.CONFIGURE_SERVICE_PORT
    configure_adddress = 'http://184.172.252.145:30001/'
}


nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', function (req, res) {

    function getUsers() {
        return axios.get(configure_adddress + '/users');
    }

    function getWatchers() {
        return axios.get(configure_adddress + '/watchers');
    }

    axios.all([getUsers(), getWatchers()]).then(axios.spread(function (users, watchers) {
        // console.log(watchers.data)
        // Convert epoch to date
        for (watcher_id in watchers.data) {
            epoch = watchers.data[watcher_id].last_run
            watchers.data[watcher_id].last_run = new Date(epoch * 1000)
        }

        res.render('index.html', {
            users: users.data,
            watchers: watchers.data,
            configure_adddress: configure_adddress,
        });

    }));

});

app.use(express.static('views'))
app.listen(8005, '0.0.0.0');