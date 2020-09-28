#!/bin/bash
if [ $# -eq 0 ]; 
    then
        cd ../src

        for service in cloud_object_storage compare configure gateway notify screenshot token
        do  
            echo "--------------------------------- $service ---------------------------------"
            cd $service

            docker build -t felixchen1998/web-watcher-$service:latest .
            docker push felixchen1998/web-watcher-$service:latest

            kubectl rollout restart deployment $service-deployment

            cd ..
            echo "--------------------------------- /$service ---------------------------------"
        done
else
    echo "--------------------------------- $1 ---------------------------------"
    cd ../src/$1

    docker build -t felixchen1998/web-watcher-$1:latest .
    docker push felixchen1998/web-watcher-$1:latest

    kubectl rollout restart deployment $1-deployment
    echo "--------------------------------- /$1 ---------------------------------"
fi
            
echo "================================= /done ================================="
