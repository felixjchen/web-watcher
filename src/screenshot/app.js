const {
    uuid
} = require('uuidv4');
const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs')

const app = express();

app.use(bodyParser.json());

async function screenshot(url) {

    console.log(`Starting: ${url}`)

    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    const filePath = `files/${uuid()}.png`

    await page.setViewport({
        width: 1920,
        height: 1080
    });

    await page.goto(url);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({
        path: filePath,
        fullPage: true
    });

    await browser.close();

    console.log(`Done: ${url}`)
    return filePath
}

app.get('/screenshot', async function (request, response) {

    url = request.body.url
    var filePath = await screenshot(url, filePath)
    serverFilePath = path.join(__dirname, filePath)

    response.sendFile(serverFilePath)
    response.on("finish", function () {
        fs.unlink(serverFilePath, (err) => {
            if (err) {
                console.log(err)
            }
        })
    });

});

app.listen(8003, '0.0.0.0');