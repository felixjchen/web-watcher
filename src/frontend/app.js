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
    res.render('index.html', {
        title : 'My First Nunjucks Page'
      });
});

app.use(express.static('views'))
app.listen(8005, '0.0.0.0');