const { uuid } = require("uuidv4");
const puppeteer = require("puppeteer");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
let browser = null;

app.use(bodyParser.json());

const screenshot = async (url) => {
  console.log(`Starting: ${url}`);

  const filePath = `files/${uuid()}.png`;

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto(url);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.screenshot({
    path: filePath,
    fullPage: true,
  });

  await page.close();

  console.log(`Done: ${url}`);
  return filePath;
};

app.get("/screenshot", async (req, res) => {
  let url = req.body.url;
  let filePath = await screenshot(url);
  let serverFilePath = path.join(__dirname, filePath);

  res.sendFile(serverFilePath);
  res.on("finish", function () {
    fs.unlink(serverFilePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
});

app.listen(8003, "0.0.0.0", async () => {
  browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    // headless: false,
  });

  console.log("started");
});
