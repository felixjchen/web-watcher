# Web Watcher
A microservice application to notify users when webpages change with fullpage bounding boxes highlighting the changes. 

https://webwatcher.netlify.app/

## Implementation

- React with IBM Carbon Design
- JWTs (access and refresh token), Bcrypt, Cookies and CORS
- microservice architecture, API gateway design pattern
- 4 Python services
- 3 Javascript services
- Go script

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

## Learnings

- logging
- JWTs (access and refresh token), Bcrypt, Cookies and CORS
- React excels for constant rendering, [Vanilla/jQuery frontend is painful](https://github.com/felixjchen/web-watcher/issues/8)
- Puppeteer can take full screen screenshots, Selenium cannot
- Golang's goroutines are easier to use then Python threading
- Golang's defer keyword is very useful for deleting files
- Microservice architecture allowed me to replace services seemlessly
- Microservice architecture allowed me to use different programming languages together


## Stuff

[![Netlify Status](https://api.netlify.com/api/v1/badges/9936cb1c-5bed-4ffa-add4-df35970548a7/deploy-status)](https://app.netlify.com/sites/webwatcher/deploys)

