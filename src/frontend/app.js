const axios = require('axios');
const nunjucks = require('nunjucks')
const express = require('express')
const app = express()

const production = (typeof process.env.KUBERNETES_SERVICE_HOST !== 'undefined');
const configure_adddress = 'http://0.0.0.0:8004';
if (production){
    configure_adddress = 'http://' + process.env.CONFIGURE_SERVICE_HOST + ':' + process.env.CONFIGURE_SERVICE_PORT
}

console.log('Configure service address at : ' + configure_adddress)

nunjucks.configure('views', {
    autoescape: true,
    express   : app
});

app.get('/', function(req, res) {

    function getUsers(){
        return axios.get(configure_adddress + '/users');
    }
    function getWatchers(){
        return axios.get(configure_adddress + '/watchers');
    }

    axios.all([getUsers(), getWatchers()]).then(axios.spread(function (users, watchers) {
        // console.log(users.data)
        // console.log(watchers.data)

        res.render('index.html', {
            users: users.data,
            watchers: watchers.data
        });

    }));

});

app.use(express.static('views'))
app.listen(8005, '0.0.0.0');