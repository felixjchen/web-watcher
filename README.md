# web-watcher

- application to notify users by email whenever a webpage changes, screenshots entire webpage and creates bounding boxes to show the user what has changed

- implemented with microservice architecture, 4 Python services, 2 Javascript services and one cronjob script; all containerized and ready to be deployed to a K8 Cluster 

- interactable by Material Design frontend or REST API 

## Motivation

- course work websites
- job postings

---

## Services

### cloud_object_storage

- uploads and downloads files from IBM COS (Cloud Object Storage)
- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-cloud-object-storage)
- to run locally:

    - requires:
        - python3.7
        - IBM COS, src/cloud/object_storage/secrets.py populated with service credentials & bucket named _web-watcher-files_
            
        ```
        cd src/cloud_object_storage
        pip install -r requirements.txt
        mkdir files
        # secrets.py populated with service credentials
        python app.py
        ```

    | To                         | Method | URL                             | Body          | Body Type | Response Type |
    | -------------------------- | ------ | ------------------------------- | ------------- | --------- | ------------- |
    | Upload file _F_ to COS     | POST   | http://0.0.0.0:8001/files       | {"file": _F_} | Form      | JSON          |
    | Download file _F_ from COS | GET    | http://0.0.0.0:8001/files/{*F*} | .             | .         | File          |
    | Delete file _F_ in COS     | DELETE | http://0.0.0.0:8001/files/{*F*} | .             | .         | JSON             |

### compare

- find difference between two images
- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-compare)
- to run locally:

    - requires:
        - python3.7

        ```
        cd src/compare
        pip install -r requirements.txt
        mkdir files
        python app.py
        ```

    | To                                                                     | Method | URL                                  | Body                                 | Body Type | Response Type |
    | ---------------------------------------------------------------------- | ------ | ------------------------------------ | ------------------------------------ | --------- | ------------- |
    | Get structural similarity index between images _P_ and _Q_             | GET    | http://0.0.0.0:8002/difference       | {"file_old": *P*, "file_new": *Q*}   | Form      | JSON          |
    | Create bounding boxes around the difference of images _P_ and _Q_      | GET    | http://0.0.0.0:8002/difference_image | {"file_old": *P*, "file_new": *Q*}   | Form      | File          |

### screenshot

- uses Puppeteer to screenshot an entire webpage
- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-screenshot)
- to run locally:

    - requires:
        - nodejs 12.16.3
        - npm 6.14.5
        ```
        cd src/screenshot
        npm install
        node app.js
        ```

    | To                    | Method | URL                            | Body         | Body Type | Response Type |
    | --------------------- | ------ | ------------------------------ | ------------ | --------- | ------------- |
    | Screenshot at URL _U_ | GET    | http://0.0.0.0:8003/screenshot | {"url": _U_} | JSON      | File          |

### configure

- reads and writes configuration to IBM Cloud Cloudant NoSQL
- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-configure)
- to run locally:

    - requires:
        - python3.7
        - IBM Cloudant DB, src/configure/secrets.py populated with service credentials & database named _configuration_

        ```
        cd src/configure
        pip install -r requirements.txt
        mkdir files
        # populate secrets.py with service credentials
        python app.py
        ```

    | To                                                                        | Method | URL                                  | Body                                            | Body Type | Response Type |
    | ------------------------------------------------------------------------- | ------ | ------------------------------------ | ----------------------------------------------- | --------- | ------------- |
    | List all users                                                            | GET    | http://0.0.0.0:8004/users            | .                                               | .         | JSON          |
    | Create new user with name _N_ and email _E_                               | POST   | http://0.0.0.0:8004/users            | {"name": _N_, "email": _E_}                     | JSON      | JSON          |
    | Describe user with user id *UID*                                         | GET    | http://0.0.0.0:8004/users/{_UID_}    | .                                               | .         | JSON          |
    | Update user with user id *UID*                                           | PUT    | http://0.0.0.0:8004/users/{_UID_}    | {"name": _N_, "email": _E_}                     | JSON      | JSON          |
    | Delete user with user id *UID*                                           | DELETE | http://0.0.0.0:8004/users/{_UID_}    | .                                               | .         | JSON          |
    | List all watchers                                                         | GET    | http://0.0.0.0:8004/watchers         | .                                               | .         | JSON          |
    | Create new watcher for user _UID_ at URL _U_ with frequency _F_ (seconds) | POST   | http://0.0.0.0:8004/watchers         | {"user_id": _UID_, "url":_U_, "frequency": _F_} | JSON      | JSON          |
    | Describe watcher with watcher id *WID*                                   | GET    | http://0.0.0.0:8004/watchers/{_WID_} | .                                               | .         | JSON          |
    | Update watcher with watcher id *WID*                                     | PUT    | http://0.0.0.0:8004/watchers/{_WID_} | {"user_id": _UID_, "url":_U_, "frequency": _F_} | JSON      | JSON          |
    | Delete watcher with watcher id *WID*                                     | DELETE | http://0.0.0.0:8004/watchers/{_WID_} | .                                               | .         | JSON          |

### notify

- notifies users by email 
- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-notify)
- to run locally:

    - requires:
        - python3.7

        ```
        cd src/notify
        pip install -r requirements.txt
        mkdir files
        python app.py
        ```

    | To                                                                        | Method | URL                                  | Body                                            | Body Type | Response Type |
    | ------------------------------------------------------------------------- | ------ | ------------------------------------ | ----------------------------------------------- | --------- | ------------- |
    | Notify email _E_ of a change at URL _U_ with difference image _D_         | POST   | http://0.0.0.0:8006/notify           | {"email": _E_, "url":_U_, "file": _D_}   | FORM      | JSON          |

### frontend

- UI to add/delete users and watchers
- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-frontend)
- to run locally:

    - requires:
        - nodejs 12.16.3
        - npm 6.14.5
        - configure service
        ```
        cd src/frontend
        npm install
        node app.js
        ```

    - view at https://0.0.0.0:8005

---

## Jobs

### check

- threaded for each watcher, check if the web page has changed, notify user with difference image on change
- [Docker image](https://hub.docker.com/repository/docker/felixchen1998/web-watcher-check)
- requires:
  - cloud-object-storage service
  - compare service
  - screenshot service
  - configure service
  - notify service

---

## Production

- to deploy:
    - requires:
        - kubectl configured pointing at cluster
        - service credentials for IBM COS and IBM Cloudant database in kubernetes/secrets & email username and password in kubernetes/secrets
        ```
        kubectl apply -f kubernetes/secrets
        kubectl apply -f kubernetes/services
        kubectl apply -f kubernetes/deployments
        kubectl apply -f kubernetes/jobs
        ```
    
    - frontend at https://CLUSTER_PUBLIC_IP:30001
    - configure API at https://CLUSTER_PUBLIC_IP:30000

---

## to do

- check: this will likely be faster and cheaper in Go , because of concurency oppurtinities in script
- tests for every application for every endpoint
- error checking and handling
- use alpine images 
- frontend: add editing, react may have been a better choice for this app
