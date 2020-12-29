#!/bin/bash            
echo "================================= redeploy ================================="

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
    cd ../src

    for service in "$@"
    do
        echo "--------------------------------- $service ---------------------------------"
        cd $service

        docker build -t felixchen1998/web-watcher-$service:latest .
        docker push felixchen1998/web-watcher-$service:latest

        kubectl rollout restart deployment $service-deployment

        cd ..
        echo "--------------------------------- /$service ---------------------------------"
    done
fi
            
echo "================================= /redeploy ================================="
