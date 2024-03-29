

Captures web page changes and notifies users


 🌐 [Application](https://webwatcher.netlify.app/) Note: This is not maintained anymore

## Implementation

- Deployed with AWS API Gateway, IBM Cloud Kubernetes Service, IBM COS, IBM Cloudant DB
- React with IBM Carbon Design
- microservice architecture, API gateway design pattern
- JWTs (access and refresh token), Bcrypt, Cookies and CORS
- 4 Python services
- 3 Javascript services
- Go Cronjob script

## To do

- notification service rework, for easier redeployment, AWS?
- configure service is slow in Python...
- compare service takes alot of memory in Python... Go perhaps? 
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

---

## Service Endpoints (Outdated)

### cloud_object_storage

- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-cloud-object-storage)
- uploads and downloads files from IBM COS (Cloud Object Storage)
- requires:
  - python3.7
  - IBM COS, src/cloud_object_storage/secrets.py populated with service credentials & bucket named _web-watcher-files_
- to run locally:
  ```
  cd src/cloud_object_storage
  pip install -r requirements.txt
  mkdir files
  # secrets.py populated with service credentials
  python app.py
  ```
- endpoints
  | To                         | Method | URL                           | Body          | Body Type | Response Type |
  | -------------------------- | ------ | ----------------------------- | ------------- | --------- | ------------- |
  | Upload file _F_ to COS     | POST   | http://0.0.0.0:8001/files     | {"file": _F_} | Form      | JSON          |
  | Download file _F_ from COS | GET    | http://0.0.0.0:8001/files/{F} | .             | .         | File          |
  | Delete file _F_ in COS     | DELETE | http://0.0.0.0:8001/files/{F} | .             | .         | JSON          |

### compare

- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-compare)
- find difference between two images using opencv2 and scikit-image
- requires
  - python3.7
- to run locally
  ```
  cd src/compare
  pip install -r requirements.txt
  mkdir files
  python app.py
  ```
- endpoints
  | To                                                                | Method | URL                                  | Body                               | Body Type | Response Type |
  | ----------------------------------------------------------------- | ------ | ------------------------------------ | ---------------------------------- | --------- | ------------- |
  | Get structural similarity index between images _P_ and _Q_        | GET    | http://0.0.0.0:8002/difference       | {"file_old": *P*, "file_new": *Q*} | Form      | JSON          |
  | Create bounding boxes around the difference of images _P_ and _Q_ | GET    | http://0.0.0.0:8002/difference_image | {"file_old": _P_, "file_new": _Q_} | Form      | File          |

### screenshot

- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-screenshot)
- uses Puppeteer to screenshot an entire webpage
- requires
  - nodejs 12.16.3
  - npm 6.14.5
- to run locally
  ```
  cd src/screenshot
  npm install
  node app.js
  ```
- endpoints
  | To                    | Method | URL                            | Body         | Body Type | Response Type |
  | --------------------- | ------ | ------------------------------ | ------------ | --------- | ------------- |
  | Screenshot at URL _U_ | GET    | http://0.0.0.0:8003/screenshot | {"url": _U_} | JSON      | File          |

### configure

- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-configure)
- reads and writes configuration to IBM Cloud Cloudant NoSQL
- requires
  - python3.7
  - IBM Cloudant DB, src/configure/secrets.py populated with service credentials & database named _configuration_
- to run locally
  ```
  cd src/configure
  pip install -r requirements.txt
  mkdir files
  # populate secrets.py with service credentials
  python app.py
  ```
- endpoints
  | To                                                                        | Method | URL                                | Body                                            | Body Type | Response Type |
  | ------------------------------------------------------------------------- | ------ | ---------------------------------- | ----------------------------------------------- | --------- | ------------- |
  | List all users                                                            | GET    | http://0.0.0.0:8004/users          | .                                               | .         | JSON          |
  | Create new user with name _N_ and email _E_                               | POST   | http://0.0.0.0:8004/users          | {"name": _N_, "email": _E_}                     | JSON      | JSON          |
  | Describe user with user id _UID_                                          | GET    | http://0.0.0.0:8004/users/{UID}    | .                                               | .         | JSON          |
  | Update user with user id _UID_                                            | PUT    | http://0.0.0.0:8004/users/{UID}    | {"name": _N_, "email": _E_}                     | JSON      | JSON          |
  | Delete user with user id _UID_                                            | DELETE | http://0.0.0.0:8004/users/{UID}    | .                                               | .         | JSON          |
  | List all watchers                                                         | GET    | http://0.0.0.0:8004/watchers       | .                                               | .         | JSON          |
  | Create new watcher for user _UID_ at URL _U_ with frequency _F_ (seconds) | POST   | http://0.0.0.0:8004/watchers       | {"user_id": *UID*, "url":_U_, "frequency": _F_} | JSON      | JSON          |
  | Describe watcher with watcher id _WID_                                    | GET    | http://0.0.0.0:8004/watchers/{WID} | .                                               | .         | JSON          |
  | Update watcher with watcher id _WID_                                      | PUT    | http://0.0.0.0:8004/watchers/{WID} | {"user_id": *UID*, "url":_U_, "frequency": _F_} | JSON      | JSON          |
  | Delete watcher with watcher id _WID_                                      | DELETE | http://0.0.0.0:8004/watchers/{WID} | .                                               | .         | JSON          |

### notify

- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-notify)
- notifies users by email using smtplib and Gmail account
- requires
  - python3.7
- to run locally
  ```
  cd src/notify
  pip install -r requirements.txt
  mkdir files
  python app.py
  ```
- endpoints
  | To                                                                | Method | URL                        | Body                                   | Body Type | Response Type |
  | ----------------------------------------------------------------- | ------ | -------------------------- | -------------------------------------- | --------- | ------------- |
  | Notify email _E_ of a change at URL _U_ with difference image _D_ | POST   | http://0.0.0.0:8006/notify | {"email": _E_, "url":_U_, "file": _D_} | FORM      | JSON          |

### frontend

- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-frontend)
- UI to add/delete users and watchers using Google's Material Design
- requires
  - nodejs 12.16.3
  - npm 6.14.5
  - configure service
- to run locally
  ```
  cd src/frontend
  npm install
  node app.js
  ```
- view at https://0.0.0.0:8005

## Cron Jobs

### check

- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-check)
- threaded for each watcher, check if the web page has changed, notify user with difference image on change
- requires
  - go 1.14
  - cloud-object-storage service
  - compare service
  - screenshot service
  - configure service
  - notify service
