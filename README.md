# Web Watcher

- [Frontend](https://webwatcher.netlify.app/)
- [Gateway](https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod/login)

- application to notify users by email whenever a webpage changes, screenshots entire webpage and creates bounding boxes to show the user what has changed

## Implementation

- React with IBM Carbon Design
- JWTs (access and refresh token), Bcrypt, Cookies and CORS
- microservice architecture, API gateway design pattern
- 4 Python services
- 3 Javascript services
- Go Cron script

## Motivation

- course work websites
- job postings
- shopping
- upcoming releases

## Services

### token

- signs JWT access_tokens, refresh_tokens upon successful login
- signs JWT access_tokens given refresh_token

### cloud_object_storage

- uploads and downloads files from IBM COS (Cloud Object Storage)

### compare

- find difference between two images using opencv2 and scikit-image

### screenshot

- uses Puppeteer to screenshot an entire webpage

### configure

- reads and writes configuration to IBM Cloud CouchDB NoSQL

### notify

- notifies users by email using smtplib and Gmail account

### frontend

- UI to sign up, login, add and delete watchers
- IBM Carbon Design with React

## Cron Jobs

### check

- threaded for each watcher, check if the web page has changed, notify user with difference image on changex

## Stuff

[![Netlify Status](https://api.netlify.com/api/v1/badges/9936cb1c-5bed-4ffa-add4-df35970548a7/deploy-status)](https://app.netlify.com/sites/webwatcher/deploys)

- https://accounts.google.com/DisplayUnlockCaptcha

## To do

- notification service rework, for easier redeployment, AWS?
- configure service is slow in Python...
- compare service takes alot of memory in Python... Go perhaps? Create a new algo?
- figure out IBM API Gateway CORS (cannot configure last time I tried...), save cents from AWS bill
- remove token service, add all auth to Gateway
- swagger docs
- graphql
- better logging
- test suite
- use alpine images

## Takeaways

- log events
- JWTs (access and refresh token), Bcrypt, Cookies and CORS
- React excels for constant rendering, [Vanilla/jQuery frontend is painful](https://github.com/felixjchen/web-watcher/issues/8)
- Puppeteer can take full screen screenshots, Selenium cannot
- Golang's goroutines are easier to use then Python threading
- Golang's defer keyword is very useful for deleting files
- Microservice architecure allowed me to replace services seemlessly
- Microservice architecure allowed me to use different programming languages together
